// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./TitleRegistry.sol";
import "./KYCRegistry.sol";
import "./LienRegistry.sol";
import "./EscrowMultiSig.sol";
import "./FeeSplitter.sol";

contract Marketplace is ReentrancyGuard {
    TitleRegistry public titleRegistry;
    KYCRegistry   public kycRegistry;
    LienRegistry  public lienRegistry;
    FeeSplitter   public feeSplitter;

    address[] public escrowSigners;
    uint256 public escrowThreshold;
    uint256 public feePercent; // e.g. 1 for 1%

    struct Listing {
        uint256 price;
        address seller;
        bool    active;
    }

    mapping(uint256 => Listing) public listings;      // deedId → Listing
    mapping(uint256 => address) public escrowForDeed; // deedId → Escrow address

    event Listed(uint256 indexed deedId, address indexed seller, uint256 price);
    event Unlisted(uint256 indexed deedId, address indexed seller);
    event Bought(uint256 indexed deedId, address indexed buyer, address escrow);

    constructor(
        address _titleRegistry,
        address _kycRegistry,
        address _lienRegistry,
        address[] memory _escrowSigners,
        uint256 _escrowThreshold,
        address payable _feeSplitter,  // make this payable
        uint256 _feePercent
    ) {
        require(_titleRegistry != address(0), "Invalid TitleRegistry");
        require(_kycRegistry   != address(0), "Invalid KYCRegistry");
        require(_lienRegistry  != address(0), "Invalid LienRegistry");
        require(_feeSplitter   != address(0), "Invalid FeeSplitter");
        require(_escrowSigners.length >= _escrowThreshold && _escrowThreshold > 0, "Invalid escrow params");
        require(_feePercent <= 100, "Fee percent too high");

        titleRegistry   = TitleRegistry(_titleRegistry);
        kycRegistry     = KYCRegistry(_kycRegistry);
        lienRegistry    = LienRegistry(_lienRegistry);
        feeSplitter     = FeeSplitter(_feeSplitter);
        escrowSigners   = _escrowSigners;
        escrowThreshold = _escrowThreshold;
        feePercent      = _feePercent;
    }

    modifier onlyKYCed() {
        require(kycRegistry.isKYCed(msg.sender), "Must be KYC verified");
        _;
    }

    function listForSale(uint256 deedId, uint256 price) external onlyKYCed {
        require(titleRegistry.ownerOf(deedId) == msg.sender, "Not deed owner");
        require(lienRegistry.activeLiensCount(deedId) == 0, "Active liens exist");
        require(price > 0, "Price must be > 0");

        listings[deedId] = Listing({ price: price, seller: msg.sender, active: true });
        emit Listed(deedId, msg.sender, price);
    }

    function unlist(uint256 deedId) external {
        Listing storage l = listings[deedId];
        require(l.active, "Not listed");
        require(l.seller == msg.sender, "Not seller");
        l.active = false;
        emit Unlisted(deedId, msg.sender);
    }

    function buy(uint256 deedId) external payable onlyKYCed nonReentrant {
        Listing storage l = listings[deedId];
        require(l.active, "Not for sale");
        require(msg.value == l.price, "Incorrect payment");
        require(titleRegistry.ownerOf(deedId) == l.seller, "Seller no longer owns deed");
        require(lienRegistry.activeLiensCount(deedId) == 0, "Active liens exist");

        uint256 fee = (msg.value * feePercent) / 100;
        uint256 net = msg.value - fee;

        // 1) Send fee to FeeSplitter
        (bool feeOk, ) = address(feeSplitter).call{ value: fee }("");
        require(feeOk, "Fee transfer failed");

        // 2) Deploy a new EscrowMultiSig for this deed
        EscrowMultiSig escrow = new EscrowMultiSig(escrowSigners, escrowThreshold);
        escrowForDeed[deedId] = address(escrow);

        // 3) Fund escrow with net proceeds
        (bool fundOk, ) = address(escrow).call{ value: net }("");
        require(fundOk, "Funding escrow failed");

        // 4) Schedule deed transfer in escrow
        bytes memory data = abi.encodeWithSelector(
            titleRegistry.transferFrom.selector,
            l.seller,
            msg.sender,
            deedId
        );
        escrow.submitTx(address(titleRegistry), 0, data);

        // 5) Mark listing inactive
        l.active = false;

        emit Bought(deedId, msg.sender, address(escrow));
    }
}
