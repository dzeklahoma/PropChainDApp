// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EscrowMultiSig is ReentrancyGuard {
    address[] public signers;
    uint256 public threshold;
    uint256 public nextTxId;

    struct TxRequest {
        address to;
        uint256 amount;
        bytes data;
    }

    mapping(uint256 => TxRequest) public txRequests;
    mapping(uint256 => mapping(address => bool)) public approvals;
    mapping(uint256 => bool) public executed;

    event TxSubmitted(uint256 indexed txId, address indexed to, uint256 amount, bytes data);
    event TxApproved(uint256 indexed txId, address indexed signer);
    event TxExecuted(uint256 indexed txId);

    constructor(address[] memory _signers, uint256 _threshold) {
        require(_signers.length >= _threshold && _threshold > 0, "Invalid threshold");
        signers = _signers;
        threshold = _threshold;
    }

    modifier onlySigner() {
        bool isSigner = false;
        for (uint i = 0; i < signers.length; i++) {
            if (msg.sender == signers[i]) {
                isSigner = true;
                break;
            }
        }
        require(isSigner, "Not authorized");
        _;
    }

    /// @notice Deposit funds into this contract for escrow.
    receive() external payable {}

    /// @notice Any signer can submit a new transaction request.
    function submitTx(address to, uint256 amount, bytes calldata data) external onlySigner {
        uint256 txId = nextTxId++;
        txRequests[txId] = TxRequest({ to: to, amount: amount, data: data });
        emit TxSubmitted(txId, to, amount, data);
    }

    /// @notice Any signer can approve a pending transaction.
    function approveTx(uint256 txId) external onlySigner {
        require(!approvals[txId][msg.sender], "Already approved");
        approvals[txId][msg.sender] = true;
        emit TxApproved(txId, msg.sender);
    }

    /// @notice Executes transaction once enough signers have approved.
    function executeTx(uint256 txId) external nonReentrant onlySigner {
        require(!executed[txId], "Already executed");
        uint256 count;
        for (uint i = 0; i < signers.length; i++) {
            if (approvals[txId][signers[i]]) {
                count++;
                if (count >= threshold) {
                    break;
                }
            }
        }
        require(count >= threshold, "Insufficient approvals");
        executed[txId] = true;

        TxRequest storage req = txRequests[txId];
        (bool success, ) = req.to.call{ value: req.amount }(req.data);
        require(success, "Transaction failed");
        emit TxExecuted(txId);
    }
}
