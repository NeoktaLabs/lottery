// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SingleWinnerDeployer
 * @notice
 * Deploys LotterySingleWinner instances and registers them in the LotteryRegistry.
 *
 * IMPORTANT FIX (Approval Paradox):
 * - We DO NOT pull USDC in the lottery constructor from the end-user.
 * - Instead, the end-user approves THIS Deployer for `winningPot`.
 * - The Deployer deploys the Lottery, then transfers USDC from user -> Lottery,
 *   then calls lottery.confirmFunding() to activate it.
 *
 * Fee model (global for NEW lotteries):
 * - Safe can update `feeRecipient` and `protocolFeePercent` here.
 * - Those updates affect ONLY newly created lotteries.
 * - Existing lottery instances keep their immutable values.
 */

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./LotteryRegistry.sol";
import "./LotterySingleWinner.sol";

contract SingleWinnerDeployer {
    using SafeERC20 for IERC20;

    // -----------------------------
    // Errors
    // -----------------------------
    error NotOwner();
    error ZeroAddress();
    error FeeTooHigh();

    // -----------------------------
    // Events
    // -----------------------------
    event DeployerOwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    /// @notice Emitted when global deployer config is updated (affects new lotteries only).
    event ConfigUpdated(
        address usdc,
        address entropy,
        address provider,
        address feeRecipient,
        uint256 protocolFeePercent
    );

    // -----------------------------
    // Ownership (owner should be your Safe)
    // -----------------------------
    address public owner;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    // -----------------------------
    // Configuration (shared across all new SingleWinner lotteries)
    // -----------------------------
    LotteryRegistry public immutable registry;
    address public immutable safeOwner;

    uint256 public constant SINGLE_WINNER_TYPE_ID = 1;

    address public usdc;
    address public entropy;
    address public entropyProvider;

    /// @notice Protocol fee recipient (external wallet, not the Safe). Affects new lotteries only.
    address public feeRecipient;

    /// @notice Protocol fee percent (0-20). Affects new lotteries only.
    uint256 public protocolFeePercent;

    constructor(
        address _owner,
        address _registry,
        address _safeOwner,
        address _usdc,
        address _entropy,
        address _entropyProvider,
        address _feeRecipient,
        uint256 _protocolFeePercent
    ) {
        if (
            _owner == address(0) ||
            _registry == address(0) ||
            _safeOwner == address(0) ||
            _usdc == address(0) ||
            _entropy == address(0) ||
            _entropyProvider == address(0) ||
            _feeRecipient == address(0)
        ) revert ZeroAddress();

        if (_protocolFeePercent > 20) revert FeeTooHigh();

        owner = _owner;
        registry = LotteryRegistry(_registry);
        safeOwner = _safeOwner;

        usdc = _usdc;
        entropy = _entropy;
        entropyProvider = _entropyProvider;
        feeRecipient = _feeRecipient;
        protocolFeePercent = _protocolFeePercent;

        emit DeployerOwnershipTransferred(address(0), _owner);
        emit ConfigUpdated(_usdc, _entropy, _entropyProvider, _feeRecipient, _protocolFeePercent);
    }

    /**
     * @notice Safe can rotate config if needed (e.g. entropy contract upgrade),
     *         without changing registry or frontend.
     *
     * IMPORTANT:
     * - These values are applied ONLY to lotteries created after this update.
     * - Existing lottery instances are immutable.
     */
    function setConfig(
        address _usdc,
        address _entropy,
        address _entropyProvider,
        address _feeRecipient,
        uint256 _protocolFeePercent
    ) external onlyOwner {
        if (_usdc == address(0) || _entropy == address(0) || _entropyProvider == address(0) || _feeRecipient == address(0)) {
            revert ZeroAddress();
        }
        if (_protocolFeePercent > 20) revert FeeTooHigh();

        usdc = _usdc;
        entropy = _entropy;
        entropyProvider = _entropyProvider;
        feeRecipient = _feeRecipient;
        protocolFeePercent = _protocolFeePercent;

        emit ConfigUpdated(_usdc, _entropy, _entropyProvider, _feeRecipient, _protocolFeePercent);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit DeployerOwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // -----------------------------
    // Deployment Entry Point
    // -----------------------------
    function createSingleWinnerLottery(
        string calldata name,
        uint256 ticketPrice,
        uint256 winningPot,
        uint64 minTickets,
        uint64 maxTickets,
        uint64 durationSeconds,
        uint32 minPurchaseAmount
    ) external returns (address lotteryAddr) {
        LotterySingleWinner lot = new LotterySingleWinner(
            address(registry),
            usdc,
            entropy,
            entropyProvider,
            feeRecipient,
            protocolFeePercent,
            msg.sender, // creator
            name,
            ticketPrice,
            winningPot,
            minTickets,
            maxTickets,
            durationSeconds,
            minPurchaseAmount
        );

        IERC20(usdc).safeTransferFrom(msg.sender, address(lot), winningPot);
        lot.confirmFunding();
        lot.transferOwnership(safeOwner);

        lotteryAddr = address(lot);

        registry.registerLottery(SINGLE_WINNER_TYPE_ID, lotteryAddr, msg.sender);
    }
}
