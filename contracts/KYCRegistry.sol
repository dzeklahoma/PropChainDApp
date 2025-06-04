// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract KYCRegistry is AccessControl {
    bytes32 public constant KYC_ADMIN = keccak256("KYC_ADMIN");
    mapping(address => bool) public isKYCed;

    event KYCApproved(address indexed user);
    event KYCRevoked(address indexed user);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(KYC_ADMIN, admin);
    }

    function approveKYC(address user) external onlyRole(KYC_ADMIN) {
        require(!isKYCed[user], "Already KYCed");
        isKYCed[user] = true;
        emit KYCApproved(user);
    }

    function revokeKYC(address user) external onlyRole(KYC_ADMIN) {
        require(isKYCed[user], "Not KYCed");
        isKYCed[user] = false;
        emit KYCRevoked(user);
    }
}
