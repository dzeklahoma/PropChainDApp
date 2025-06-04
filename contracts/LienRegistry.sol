// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./TitleRegistry.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LienRegistry is AccessControl {
    bytes32 public constant LIEN_MANAGER_ROLE = keccak256("LIEN_MANAGER_ROLE");

    struct Lien {
        address lender;
        uint256 amount;
        bool active;
    }

    // deedId → list of liens
    mapping(uint256 => Lien[]) public propertyLiens;
    TitleRegistry public titleRegistry;

    event LienAdded(uint256 indexed deedId, address indexed lender, uint256 amount);
    event LienCleared(uint256 indexed deedId, uint256 indexed lienIndex);

    constructor(address _titleRegistry, address gov) {
        require(_titleRegistry != address(0), "Invalid TitleRegistry");
        titleRegistry = TitleRegistry(_titleRegistry);
        _grantRole(DEFAULT_ADMIN_ROLE, gov);
        _grantRole(LIEN_MANAGER_ROLE, gov);
    }

    /// @notice Only Lien Manager can add a new lien on a deed.
    function addLien(uint256 deedId, uint256 amount) external onlyRole(LIEN_MANAGER_ROLE) {
        require(titleRegistry.ownerOf(deedId) != address(0), "Deed does not exist");
        propertyLiens[deedId].push(Lien({ lender: msg.sender, amount: amount, active: true }));
        emit LienAdded(deedId, msg.sender, amount);
    }

    /// @notice Clears a lien at `lienIndex` for `deedId`. Must be active.
    function clearLien(uint256 deedId, uint256 lienIndex) external onlyRole(LIEN_MANAGER_ROLE) {
        require(lienIndex < propertyLiens[deedId].length, "Invalid lien index");
        Lien storage ln = propertyLiens[deedId][lienIndex];
        require(ln.active, "Lien already cleared");
        ln.active = false;
        emit LienCleared(deedId, lienIndex);
    }

    /// @notice View active liens count for a deed.
    function activeLiensCount(uint256 deedId) external view returns (uint256) {
        uint256 count;
        Lien[] storage arr = propertyLiens[deedId];
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i].active) {
                count++;
            }
        }
        return count;
    }
}
