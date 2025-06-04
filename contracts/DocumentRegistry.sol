// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DocumentRegistry is AccessControl {
    bytes32 public constant DOC_MANAGER_ROLE = keccak256("DOC_MANAGER_ROLE");

    // deedId → array of document IPFS hashes
    mapping(uint256 => string[]) private propertyDocuments;

    event DocumentAdded(uint256 indexed deedId, string indexed ipfsHash);
    event DocumentRemoved(uint256 indexed deedId, string indexed ipfsHash);

    constructor(address gov) {
        _grantRole(DEFAULT_ADMIN_ROLE, gov);
        _grantRole(DOC_MANAGER_ROLE, gov);
    }

    /// @notice Adds an IPFS hash under `deedId`.
    function addDocument(uint256 deedId, string memory ipfsHash) external onlyRole(DOC_MANAGER_ROLE) {
        propertyDocuments[deedId].push(ipfsHash);
        emit DocumentAdded(deedId, ipfsHash);
    }

    /// @notice Removes a document by matching `ipfsHash` under `deedId`.
    function removeDocument(uint256 deedId, string memory ipfsHash) external onlyRole(DOC_MANAGER_ROLE) {
        string[] storage arr = propertyDocuments[deedId];
        for (uint i = 0; i < arr.length; i++) {
            if (keccak256(bytes(arr[i])) == keccak256(bytes(ipfsHash))) {
                // Replace with last and pop
                arr[i] = arr[arr.length - 1];
                arr.pop();
                emit DocumentRemoved(deedId, ipfsHash);
                return;
            }
        }
        revert("Document not found");
    }

    /// @notice Returns all document hashes for a given deedId.
    function getDocuments(uint256 deedId) external view returns (string[] memory) {
        return propertyDocuments[deedId];
    }
}
