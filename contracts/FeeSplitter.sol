// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract FeeSplitter {
    address[] public recipients;
    uint256[] public shares; // must sum to 100

    event FeeDistributed(uint256 amount);

    constructor(address[] memory _recipients, uint256[] memory _shares) {
        require(_recipients.length == _shares.length, "Length mismatch");
        uint256 total;
        for (uint256 i = 0; i < _shares.length; i++) {
            total += _shares[i];
        }
        require(total == 100, "Shares must sum to 100");

        recipients = _recipients;
        shares     = _shares;
    }

    receive() external payable {
        uint256 amt = msg.value;
        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 part = (amt * shares[i]) / 100;
            payable(recipients[i]).transfer(part);
        }
        emit FeeDistributed(amt);
    }
}
