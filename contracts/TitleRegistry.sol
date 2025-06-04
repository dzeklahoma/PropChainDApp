// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TitleRegistry is ERC721, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");
    string private _baseTokenURI;

    event DeedMinted(uint256 indexed deedId, address indexed owner);
    event DeedTransferred(uint256 indexed deedId, address indexed from, address indexed to);
    event BaseURIChanged(string newBaseURI);

    constructor(address gov, string memory initialBaseURI) ERC721("RealEstateDeed", "DEED") {
        _grantRole(DEFAULT_ADMIN_ROLE, gov);
        _grantRole(GOVERNMENT_ROLE, gov);
        _baseTokenURI = initialBaseURI;
    }

    /// @notice Mint a new deed (ERC-721) to `to`. Only GOVERNMENT_ROLE may call.
    function mintDeed(address to) external onlyRole(GOVERNMENT_ROLE) returns (uint256) {
        uint256 newId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, newId);
        emit DeedMinted(newId, to);
        return newId;
    }

    /// @notice Transfer deed `deedId` from its owner to `to`. Caller must be owner or approved.
    function transferDeed(uint256 deedId, address to) external {
        address deedOwner = ownerOf(deedId);

        bool isOwner    = (msg.sender == deedOwner);
        bool isApproved = (getApproved(deedId) == msg.sender);
        bool isOperator = isApprovedForAll(deedOwner, msg.sender);
        require(isOwner || isApproved || isOperator, "Not owner or approved");

        _transfer(deedOwner, to, deedId);
        emit DeedTransferred(deedId, deedOwner, to);
    }

    /// @notice Set a new base URI (only GOVERNMENT_ROLE).
    function setBaseURI(string memory newBase) external onlyRole(GOVERNMENT_ROLE) {
        _baseTokenURI = newBase;
        emit BaseURIChanged(newBase);
    }

    /// @dev Returns `baseURI + tokenId` by default.
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /// @notice Get the full tokenURI (i.e. baseURI + tokenId).
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_baseURI(), _toString(tokenId)));
    }

    /// @notice Solidity's `uint256 -> string` helper.
    function _toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OpenZeppelin's Strings.toString
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + value % 10));
            value /= 10;
        }
        return string(buffer);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
