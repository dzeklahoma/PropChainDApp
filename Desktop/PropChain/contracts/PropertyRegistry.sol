// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./PropChain.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract PropertyRegistry is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    enum Status { Pending, Verified, Rejected, Withdrawn }

    struct PropertyRequest {
        address applicant;
        string ipfsHash;
        Status status;
        uint256 tokenId;
        uint256 timestamp;
    }

    uint256 public requestCounter;
    uint256 public registrationFee = 0; // Set > 0 if needed

    mapping(uint256 => PropertyRequest) public propertyRequests;
    mapping(address => uint256[]) private userRequests;
    mapping(bytes32 => bool) public submittedHashes;
    mapping(address => bool) public isActiveVerifier;

    PropChain public propChainContract;

    event PropertyRequested(uint256 indexed requestId, address indexed applicant, string ipfsHash);
    event PropertyVerified(uint256 indexed requestId, uint256 tokenId);
    event PropertyRejected(uint256 indexed requestId);
    event PropertyWithdrawn(uint256 indexed requestId);

    constructor(address admin, address propChainAddress) {
    _grantRole(DEFAULT_ADMIN_ROLE, admin);
    _grantRole(VERIFIER_ROLE, admin);
    isActiveVerifier[admin] = true;
    propChainContract = PropChain(propChainAddress);
}


    function requestProperty(string memory ipfsHash) external payable returns (uint256) {
        require(msg.value == registrationFee, "Invalid registration fee");

        bytes32 hashKey = keccak256(abi.encodePacked(ipfsHash));
        require(!submittedHashes[hashKey], "Duplicate request");

        propertyRequests[requestCounter] = PropertyRequest({
            applicant: msg.sender,
            ipfsHash: ipfsHash,
            status: Status.Pending,
            tokenId: 0,
            timestamp: block.timestamp
        });

        submittedHashes[hashKey] = true;
        userRequests[msg.sender].push(requestCounter);

        emit PropertyRequested(requestCounter, msg.sender, ipfsHash);
        requestCounter++;
        return requestCounter - 1;
    }

    function verifyProperty(uint256 requestId) external onlyRole(VERIFIER_ROLE) {
        require(isActiveVerifier[msg.sender], "Verifier suspended");

        PropertyRequest storage request = propertyRequests[requestId];
        require(request.status == Status.Pending, "Not pending");
        require(request.tokenId == 0, "Already minted");

        uint256 tokenId = propChainContract.mintProperty(request.applicant, request.ipfsHash);
        request.status = Status.Verified;
        request.tokenId = tokenId;

        emit PropertyVerified(requestId, tokenId);
    }

    function rejectProperty(uint256 requestId) external onlyRole(VERIFIER_ROLE) {
        require(isActiveVerifier[msg.sender], "Verifier suspended");

        PropertyRequest storage request = propertyRequests[requestId];
        require(request.status == Status.Pending, "Not pending");
        request.status = Status.Rejected;

        emit PropertyRejected(requestId);
    }

    function withdrawRequest(uint256 requestId) external {
        PropertyRequest storage request = propertyRequests[requestId];
        require(request.applicant == msg.sender, "Not your request");
        require(request.status == Status.Pending, "Cannot withdraw");

        request.status = Status.Withdrawn;

        emit PropertyWithdrawn(requestId);
    }

    function getPropertyRequest(uint256 requestId) external view returns (PropertyRequest memory) {
        return propertyRequests[requestId];
    }

    function getUserRequests(address user) external view returns (uint256[] memory) {
        return userRequests[user];
    }

    function setRegistrationFee(uint256 fee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        registrationFee = fee;
    }

    function suspendVerifier(address verifier, bool isActive) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isActiveVerifier[verifier] = isActive;
    }
}
