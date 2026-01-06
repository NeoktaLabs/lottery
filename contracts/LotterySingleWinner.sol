// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";

interface IEntropyConsumer {
    function entropyCallback(uint64 sequenceNumber, address provider, bytes32 randomNumber) external;
}

/**
 * @title LotterySingleWinner
 * @notice A single-winner lottery instance using Pyth Entropy for randomness.
 * @dev Designed for Etherlink Mainnet. Features pull-payments, binary search winner lookup,
 * and storage range compression for gas efficiency.
 */
contract LotterySingleWinner is Ownable, IEntropyConsumer, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // -----------------------------
    // Errors
    // -----------------------------
    error InvalidRegistry();
    error InvalidEntropy();
    error InvalidProvider();
    error InvalidUSDC();
    error InvalidFeeRecipient();
    error InvalidCreator();
    error NameEmpty();
    error NameTooLong();
    error DurationTooShort();
    error DurationTooLong();     
    error InvalidPrice();
    error PriceTooHigh();        
    error InvalidPot();
    error PotTooHigh();          
    error InvalidMinTickets();
    error MaxLessThanMin();
    error MinPurchaseTooLarge();
    error InvalidCount();
    error BatchTooLarge();
    error BatchTooSmall();
    error BatchTooCheap();
    error TooManyRanges();
    error Overflow();
    error LotteryNotOpen();
    error LotteryExpired();
    error TicketLimitReached();
    error RequestPending();
    error NotReadyToFinalize();
    error NoParticipants();
    error InsufficientFee();
    error InvalidRequest();
    error UnauthorizedCallback();
    error NotDrawing();
    error NotCanceled();
    error CreatorCannotBuy();
    error CannotCancel();
    error EmergencyHatchLocked();
    error NothingToClaim();
    error NothingToRefund();
    error FeeTooHigh();
    error DrawingsActive();
    error NativeRefundFailed(); 
    error AccountingMismatch();
    error EarlyCancellationRequest();
    error NotDeployer();
    error NotFundingPending();
    error FundingMismatch();

    // -----------------------------
    // Events
    // -----------------------------
    event CallbackRejected(uint64 indexed sequenceNumber, uint8 reasonCode);

    event TicketsPurchased(
        address indexed buyer, 
        uint256 count, 
        uint256 totalCost, 
        uint256 totalSold,
        uint256 rangeIndex,
        bool isNewRange // Helps indexers know if they should push a new card or update existing
    );
    
    event LotteryFinalized(uint64 requestId, uint256 totalSold, address provider);
    event WinnerPicked(address indexed winner, uint256 winningTicketIndex, uint256 totalSold);

    event LotteryCanceled(string reason);
    event EmergencyRecovery();

    event RefundAllocated(address indexed user, uint256 amount);
    event FundsClaimed(address indexed user, uint256 amount);

    // Naming Note: "Native" refers to the chain's gas token (XTZ on Etherlink).
    // We use generic "Native" naming to maintain Solidity standards and portability.
    event NativeRefundAllocated(address indexed user, uint256 amount);
    event NativeClaimed(address indexed user, uint256 amount);

    event ProtocolFeesCollected(uint256 amount);

    event EntropyProviderUpdated(address newProvider);
    event EntropyContractUpdated(address newContract);
    event GovernanceLockUpdated(uint256 activeDrawings);

    event PrizeAllocated(address indexed user, uint256 amount, uint8 indexed reason);

    event FundingConfirmed(address indexed funder, uint256 amount);

    // -----------------------------
    // Immutables / Config
    // -----------------------------
    address public immutable registry;
    IERC20 public immutable usdcToken;
    address public immutable creator;
    address public immutable feeRecipient;
    uint256 public immutable protocolFeePercent;
    address public immutable deployer;

    IEntropy public entropy;
    address public entropyProvider;

    // -----------------------------
    // Limits & Sanity Bounds
    // -----------------------------
    uint256 public constant MAX_BATCH_BUY = 1000;
    uint256 public constant MAX_RANGES = 50_000;
    uint256 public constant MIN_NEW_RANGE_COST = 1_000_000; // $1 in USDC

    // Sanity caps to prevent fat-finger deployments
    uint256 public constant MAX_TICKET_PRICE = 100_000 * 1e6; // $100k max ticket
    uint256 public constant MAX_POT_SIZE     = 10_000_000 * 1e6; // $10M max pot
    uint64  public constant MAX_DURATION     = 365 days; // 1 year max

    uint256 public constant PRIVILEGED_HATCH_DELAY = 1 days;
    uint256 public constant PUBLIC_HATCH_DELAY = 7 days;

    // -----------------------------
    // Accounting
    // -----------------------------
    uint256 public totalReservedUSDC;
    uint256 public totalClaimableNative; 
    uint256 public activeDrawings;

    // -----------------------------
    // State
    // -----------------------------
    enum Status { FundingPending, Open, Drawing, Completed, Canceled }
    Status public status;

    string public name;
    uint64 public createdAt;
    uint64 public deadline;

    uint256 public ticketPrice;
    uint256 public winningPot;
    uint256 public ticketRevenue;

    uint64 public minTickets;
    uint64 public maxTickets;
    uint32 public minPurchaseAmount;

    address public winner;
    address public selectedProvider;
    uint64 public drawingRequestedAt;
    uint64 public entropyRequestId;

    // -----------------------------
    // Ticket Ranges
    // -----------------------------
    // Gas Optimization: We store tickets as cumulative ranges instead of individual entries.
    // This reduces storage costs from O(N) to O(1) per batch purchase.
    struct TicketRange {
        address buyer;
        uint96 upperBound; 
    }

    TicketRange[] public ticketRanges;
    mapping(address => uint256) public ticketsOwned;

    // -----------------------------
    // Balances (Pull Payment Pattern)
    // -----------------------------
    mapping(address => uint256) public claimableFunds; // USDC
    mapping(address => uint256) public claimableNative; // XTZ
    bool public creatorPotRefunded;

    // -----------------------------
    // Constructor
    // -----------------------------
    constructor(
        address _registry,
        address _usdcToken,
        address _entropy,
        address _entropyProvider,
        address _feeRecipient,
        uint256 _protocolFeePercent,
        address _creator,
        string memory _name,
        uint256 _ticketPrice,
        uint256 _winningPot,
        uint64 _minTickets,
        uint64 _maxTickets,
        uint64 _durationSeconds,
        uint32 _minPurchaseAmount
    )
        Ownable(msg.sender)
    {
        deployer = msg.sender;

        if (_registry == address(0)) revert InvalidRegistry();
        if (_entropy == address(0)) revert InvalidEntropy();
        if (_usdcToken == address(0)) revert InvalidUSDC();
        if (_entropyProvider == address(0)) revert InvalidProvider();
        if (_feeRecipient == address(0)) revert InvalidFeeRecipient();
        if (_creator == address(0)) revert InvalidCreator();
        if (_protocolFeePercent > 20) revert FeeTooHigh();

        // Validate USDC decimals
        try IERC20Metadata(_usdcToken).decimals() returns (uint8 d) {
            if (d != 6) revert InvalidUSDC();
        } catch {
            revert InvalidUSDC();
        }

        // Logic & Sanity Checks
        if (bytes(_name).length == 0) revert NameEmpty();
        if (bytes(_name).length > 100) revert NameTooLong();
        if (_durationSeconds < 600) revert DurationTooShort();
        if (_durationSeconds > MAX_DURATION) revert DurationTooLong(); 

        if (_ticketPrice == 0) revert InvalidPrice();
        if (_ticketPrice > MAX_TICKET_PRICE) revert PriceTooHigh(); 

        if (_winningPot == 0) revert InvalidPot();
        if (_winningPot > MAX_POT_SIZE) revert PotTooHigh(); 

        if (_minTickets == 0) revert InvalidMinTickets();
        if (_minPurchaseAmount > MAX_BATCH_BUY) revert MinPurchaseTooLarge();
        if (_maxTickets != 0 && _maxTickets < _minTickets) revert MaxLessThanMin();

        // Ensure minimal anti-spam cost to prevent storage bloating
        uint256 minEntry = (_minPurchaseAmount == 0) ? 1 : uint256(_minPurchaseAmount);
        uint256 requiredMinPrice = (MIN_NEW_RANGE_COST + minEntry - 1) / minEntry;
        if (_ticketPrice < requiredMinPrice) revert BatchTooCheap();

        registry = _registry;
        usdcToken = IERC20(_usdcToken);
        entropy = IEntropy(_entropy);
        entropyProvider = _entropyProvider;
        feeRecipient = _feeRecipient;
        protocolFeePercent = _protocolFeePercent;
        creator = _creator;

        name = _name;
        createdAt = uint64(block.timestamp);
        deadline = uint64(block.timestamp + _durationSeconds);

        ticketPrice = _ticketPrice;
        winningPot = _winningPot;
        minTickets = _minTickets;
        maxTickets = _maxTickets;
        minPurchaseAmount = _minPurchaseAmount;

        status = Status.FundingPending;
    }

    // -----------------------------
    // Funding
    // -----------------------------
    function confirmFunding() external {
        if (msg.sender != deployer) revert NotDeployer();
        if (status != Status.FundingPending) revert NotFundingPending();

        uint256 bal = usdcToken.balanceOf(address(this));
        if (bal < winningPot) revert FundingMismatch();

        // 1. Reserve the official pot
        totalReservedUSDC = winningPot;

        // 2. Sweep excess (safety measure for dust/overfunding)
        // DECISION: Any USDC above the winningPot is treated as a refund to the creator.
        // This prevents "dust attacks" (people sending 0.0001 USDC) from getting stuck 
        // in the contract forever, and handles accidental over-funding gracefully.
        uint256 excess = bal - winningPot;
        if (excess > 0) {
            claimableFunds[creator] += excess;
            totalReservedUSDC += excess; // Add to reserve so it can be withdrawn via withdrawFunds()
            emit PrizeAllocated(creator, excess, 2); 
        }

        status = Status.Open;
        emit FundingConfirmed(msg.sender, winningPot);
    }

    // -----------------------------
    // Views
    // -----------------------------
    function getSold() public view returns (uint256) {
        uint256 len = ticketRanges.length;
        return len == 0 ? 0 : ticketRanges[len - 1].upperBound;
    }

    function getTicketRangesCount() external view returns (uint256) {
        return ticketRanges.length;
    }

    function getMinTicketsToBuy() external view returns (uint256) {
        uint256 minByCount = (minPurchaseAmount == 0) ? 1 : uint256(minPurchaseAmount);
        if (ticketPrice == 0) return minByCount;
        uint256 minByPrice = (MIN_NEW_RANGE_COST + ticketPrice - 1) / ticketPrice;
        return minByCount > minByPrice ? minByCount : minByPrice;
    }

    // -----------------------------
    // Buying Tickets
    // -----------------------------
    function buyTickets(uint256 count) external nonReentrant whenNotPaused {
        if (status != Status.Open) revert LotteryNotOpen();

        if (count == 0) revert InvalidCount();
        if (count > MAX_BATCH_BUY) revert BatchTooLarge();
        if (block.timestamp >= deadline) revert LotteryExpired();
        if (msg.sender == creator) revert CreatorCannotBuy();
        if (minPurchaseAmount > 0 && count < minPurchaseAmount) revert BatchTooSmall();

        uint256 currentSold = getSold();
        uint256 newTotal = currentSold + count;

        if (newTotal > type(uint96).max) revert Overflow();
        if (maxTickets > 0 && newTotal > maxTickets) revert TicketLimitReached();

        uint256 totalCost = ticketPrice * count;

        // Optimization: Use Ticket Ranges to save massive gas on storage.
        // We only store the cumulative count and the buyer address.
        bool returning =
            (ticketRanges.length > 0 && ticketRanges[ticketRanges.length - 1].buyer == msg.sender);

        // State Update Logic
        uint256 rangeIndex;
        bool isNewRange;

        if (returning) {
            // DECISION: If the last buyer buys again, we update the existing range.
            // This is cheaper (SSTORE vs new slot).
            // NOTE: This intentionally bypasses the `MIN_NEW_RANGE_COST` check, allowing small top-ups.
            // This is acceptable behavior to improve UX for active players.
            rangeIndex = ticketRanges.length - 1;
            isNewRange = false;
            ticketRanges[rangeIndex].upperBound = uint96(newTotal);
        } else {
            // Create new range (requires new storage slot)
            if (ticketRanges.length >= MAX_RANGES) revert TooManyRanges();
            if (totalCost < MIN_NEW_RANGE_COST) revert BatchTooCheap();

            ticketRanges.push(TicketRange({ buyer: msg.sender, upperBound: uint96(newTotal) }));
            
            rangeIndex = ticketRanges.length - 1;
            isNewRange = true;
        }

        // Accounting
        totalReservedUSDC += totalCost;
        ticketRevenue += totalCost;
        ticketsOwned[msg.sender] += count;

        // Emit with explicit indexing flags
        emit TicketsPurchased(msg.sender, count, totalCost, newTotal, rangeIndex, isNewRange);

        usdcToken.safeTransferFrom(msg.sender, address(this), totalCost);
    }

    // -----------------------------
    // Finalize (Request Randomness)
    // -----------------------------
    function finalize() external payable nonReentrant whenNotPaused {
        if (status != Status.Open) revert LotteryNotOpen();
        if (entropyRequestId != 0) revert RequestPending();

        uint256 sold = getSold();
        bool isFull = (maxTickets > 0 && sold >= maxTickets);
        bool isExpired = (block.timestamp >= deadline);

        if (!isFull && !isExpired) revert NotReadyToFinalize();

        // 1. Check for expiration failure
        if (isExpired && sold < minTickets) {
            _cancelAndRefundCreator("Min tickets not reached");
            
            // CRITICAL: Refund the Pyth fee immediately as it wasn't used.
            // If we don't do this, the Native token sent by a bot or user would be stuck 
            // in the contract balance forever because `_cancelAndRefundCreator` returns early.
            if (msg.value > 0) {
                (bool success, ) = payable(msg.sender).call{value: msg.value}("");
                if (!success) {
                    claimableNative[msg.sender] += msg.value;
                    totalClaimableNative += msg.value;
                    emit NativeRefundAllocated(msg.sender, msg.value);
                }
            }
            return;
        }

        if (sold == 0) revert NoParticipants();

        // 2. Proceed to Drawing
        status = Status.Drawing;
        drawingRequestedAt = uint64(block.timestamp);
        selectedProvider = entropyProvider;

        activeDrawings += 1;
        emit GovernanceLockUpdated(activeDrawings);

        uint256 fee = entropy.getFee(entropyProvider);
        if (msg.value < fee) revert InsufficientFee();

        uint64 requestId = entropy.requestWithCallback{value: fee}(
            entropyProvider,
            keccak256(abi.encodePacked(address(this), block.prevrandao, block.timestamp))
        );
        if (requestId == 0) revert InvalidRequest();

        entropyRequestId = requestId;

        // Refund overpayment
        if (msg.value > fee) {
            uint256 refund = msg.value - fee;
            (bool ok, ) = payable(msg.sender).call{value: refund}("");
            if (!ok) {
                claimableNative[msg.sender] += refund;
                totalClaimableNative += refund;
                emit NativeRefundAllocated(msg.sender, refund);
            }
        }

        emit LotteryFinalized(requestId, sold, entropyProvider);
    }

    // -----------------------------
    // Entropy Callback
    // -----------------------------
    function entropyCallback(uint64 sequenceNumber, address provider, bytes32 randomNumber) external override {
        if (msg.sender != address(entropy)) revert UnauthorizedCallback();
        _resolve(sequenceNumber, provider, randomNumber);
    }

    function _resolve(uint64 seq, address provider, bytes32 rand) internal {
        if (entropyRequestId == 0 || seq != entropyRequestId) {
            emit CallbackRejected(seq, 1);
            return;
        }

        // SECURITY: If the provider or status mismatches, we emit rejection and return.
        // We do NOT clear `entropyRequestId`. This leaves the lottery in a "stuck" state
        // requiring the 24h emergency hatch.
        // This is safer than auto-resetting, which could be exploited by a malicious 
        // provider to force-retry a drawing until a favorable result is found.
        if (status != Status.Drawing || provider != selectedProvider) {
            emit CallbackRejected(seq, 2);
            return;
        }

        uint256 total = getSold();
        if (total == 0) {
            emit CallbackRejected(seq, 3);
            return;
        }

        entropyRequestId = 0;

        if (activeDrawings > 0) activeDrawings -= 1;
        emit GovernanceLockUpdated(activeDrawings);

        uint256 winningIndex = uint256(rand) % total;
        address w = _findWinner(winningIndex);

        winner = w;
        status = Status.Completed;
        selectedProvider = address(0);

        uint256 feePot = (winningPot * protocolFeePercent) / 100;
        uint256 feeRev = (ticketRevenue * protocolFeePercent) / 100;

        uint256 winnerAmount = winningPot - feePot;
        claimableFunds[w] += winnerAmount;
        emit PrizeAllocated(w, winnerAmount, 1);

        uint256 creatorNet = ticketRevenue - feeRev;
        if (creatorNet > 0) {
            claimableFunds[creator] += creatorNet;
            emit PrizeAllocated(creator, creatorNet, 2);
        }

        uint256 protocolAmount = feePot + feeRev;
        if (protocolAmount > 0) {
            claimableFunds[feeRecipient] += protocolAmount;
            emit PrizeAllocated(feeRecipient, protocolAmount, 4);
        }

        emit WinnerPicked(w, winningIndex, total);
        emit ProtocolFeesCollected(protocolAmount);
    }

    function _findWinner(uint256 winningTicket) internal view returns (address) {
        uint256 low = 0;
        uint256 high = ticketRanges.length - 1;

        while (low < high) {
            uint256 mid = low + (high - low) / 2;
            if (ticketRanges[mid].upperBound > winningTicket) high = mid;
            else low = mid + 1;
        }
        return ticketRanges[low].buyer;
    }

    // -----------------------------
    // Cancel & Emergency
    // -----------------------------
    function cancel() external nonReentrant {
        if (status != Status.Open) revert CannotCancel();
        if (block.timestamp < deadline) revert CannotCancel();
        if (getSold() >= minTickets) revert CannotCancel();
        _cancelAndRefundCreator("Min tickets not reached");
    }

    function forceCancelStuck() external nonReentrant {
        if (status != Status.Drawing) revert NotDrawing();

        bool privileged = (msg.sender == owner() || msg.sender == creator);
        if (privileged) {
            if (block.timestamp <= drawingRequestedAt + PRIVILEGED_HATCH_DELAY) revert EarlyCancellationRequest();
        } else {
            if (block.timestamp <= drawingRequestedAt + PUBLIC_HATCH_DELAY) revert EmergencyHatchLocked();
        }

        emit EmergencyRecovery();
        _cancelAndRefundCreator("Emergency Recovery");
    }

    function _cancelAndRefundCreator(string memory reason) internal {
        if (status == Status.Canceled) return;

        status = Status.Canceled;
        selectedProvider = address(0);
        drawingRequestedAt = 0;
        entropyRequestId = 0;

        if (activeDrawings > 0) {
            activeDrawings = 0;
            emit GovernanceLockUpdated(activeDrawings);
        }

        if (!creatorPotRefunded && winningPot > 0) {
            creatorPotRefunded = true;

            claimableFunds[creator] += winningPot;
            emit PrizeAllocated(creator, winningPot, 5);
            emit RefundAllocated(creator, winningPot);
        }

        emit LotteryCanceled(reason);
    }

    function claimTicketRefund() external nonReentrant {
        if (status != Status.Canceled) revert NotCanceled();

        uint256 tix = ticketsOwned[msg.sender];
        if (tix == 0) revert NothingToRefund();

        uint256 refund = tix * ticketPrice;
        ticketsOwned[msg.sender] = 0;

        claimableFunds[msg.sender] += refund;
        emit PrizeAllocated(msg.sender, refund, 3);
        emit RefundAllocated(msg.sender, refund);
    }

    // -----------------------------
    // Withdrawals
    // -----------------------------
    function withdrawFunds() external nonReentrant {
        uint256 amount = claimableFunds[msg.sender];
        if (amount == 0) revert NothingToClaim();

        claimableFunds[msg.sender] = 0;
        
        // Critical Invariant Check: We only decrement liabilities after we know they are paid.
        totalReservedUSDC -= amount;
        if (totalReservedUSDC > usdcToken.balanceOf(address(this))) revert AccountingMismatch();

        usdcToken.safeTransfer(msg.sender, amount);
        emit FundsClaimed(msg.sender, amount);
    }

    function withdrawNative() external nonReentrant { 
        uint256 amount = claimableNative[msg.sender];
        if (amount == 0) revert NothingToClaim();
        if (totalClaimableNative < amount) revert AccountingMismatch();

        claimableNative[msg.sender] = 0;
        totalClaimableNative -= amount;

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        if (!ok) revert NativeRefundFailed();

        emit NativeClaimed(msg.sender, amount);
    }

    // -----------------------------
    // Admin
    // -----------------------------
    function setEntropyProvider(address p) external onlyOwner {
        if (p == address(0)) revert InvalidProvider();
        if (activeDrawings != 0) revert DrawingsActive();
        entropyProvider = p;
        emit EntropyProviderUpdated(p);
    }

    function setEntropyContract(address e) external onlyOwner {
        if (e == address(0)) revert InvalidEntropy();
        if (activeDrawings != 0) revert DrawingsActive();
        entropy = IEntropy(e);
        emit EntropyContractUpdated(e);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    receive() external payable {}
}