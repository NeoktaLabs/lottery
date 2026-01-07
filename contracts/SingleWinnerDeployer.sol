// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./LotteryRegistry.sol";
import "./LotterySingleWinner.sol";

/**
 * @title SingleWinnerDeployer
 * @notice Deploys LotterySingleWinner instances.
 */
contract SingleWinnerDeployer is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Errors
    error NotOwner();
    error ZeroAddress();
    error FeeTooHigh();
    error NotAuthorizedRegistrar();

    // Events
    event DeployerOwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    
    event LotteryDeployed(
        address indexed lottery, 
        address indexed creator, 
        uint256 winningPot, 
        uint256 ticketPrice, 
        string name,
        address usdc,
        address entropy,
        address entropyProvider,
        address feeRecipient,
        uint256 protocolFeePercent
    );

    event ConfigUpdated(
        address usdc,
        address entropy,
        address provider,
        address feeRecipient,
        uint256 protocolFeePercent
    );

    address public owner;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    LotteryRegistry public immutable registry;
    address public immutable safeOwner;

    uint256 public constant SINGLE_WINNER_TYPE_ID = 1;

    // Config
    address public usdc;
    address public entropy;
    address public entropyProvider;
    address public feeRecipient;
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

    function createSingleWinnerLottery(
        string calldata name,
        uint256 ticketPrice,
        uint256 winningPot,
        uint64 minTickets,
        uint64 maxTickets,
        uint64 durationSeconds,
        uint32 minPurchaseAmount
    ) external nonReentrant returns (address lotteryAddr) {
        
        if (!registry.isRegistrar(address(this))) revert NotAuthorizedRegistrar();

        // Pack parameters into struct to avoid Stack Too Deep error
        LotterySingleWinner.LotteryParams memory params = LotterySingleWinner.LotteryParams({
            usdcToken: usdc,
            entropy: entropy,
            entropyProvider: entropyProvider,
            feeRecipient: feeRecipient,
            protocolFeePercent: protocolFeePercent,
            creator: msg.sender,
            name: name,
            ticketPrice: ticketPrice,
            winningPot: winningPot,
            minTickets: minTickets,
            maxTickets: maxTickets,
            durationSeconds: durationSeconds,
            minPurchaseAmount: minPurchaseAmount
        });

        LotterySingleWinner lot = new LotterySingleWinner(params);

        IERC20(usdc).safeTransferFrom(msg.sender, address(lot), winningPot);
        lot.confirmFunding();
        lot.transferOwnership(safeOwner);

        lotteryAddr = address(lot);
        
        emit LotteryDeployed(
            lotteryAddr, 
            msg.sender, 
            winningPot, 
            ticketPrice, 
            name,
            usdc,
            entropy,
            entropyProvider,
            feeRecipient,
            protocolFeePercent
        );

        registry.registerLottery(SINGLE_WINNER_TYPE_ID, lotteryAddr, msg.sender);
    }
}