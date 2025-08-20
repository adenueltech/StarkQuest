// StarkEarn - Library
// Common data structures and interfaces for the StarkEarn smart contract system

// Common data structures
#[derive(Drop, Copy, PartialEq)]
enum BountyStatus {
    Open,
    InProgress,
    Completed,
    Cancelled,
}

#[derive(Drop, Copy)]
struct BountyDetails {
    title: felt252,
    description: felt252,
    reward_amount: u256,
    deadline: u64,
    token_address: ContractAddress,
    creator: ContractAddress,
    status: BountyStatus,
}

#[derive(Drop, Copy)]
struct Application {
    applicant: ContractAddress,
    timestamp: u64,
    accepted: bool,
}

#[derive(Drop, Copy)]
struct Submission {
    hunter: ContractAddress,
    content: felt252,
    timestamp: u64,
    approved: bool,
}

#[derive(Drop, Copy)]
struct ReputationRecord {
    score: u64,
    bounty_count: u64,
    completed_count: u64,
}

// Common error types
#[derive(Drop, Copy)]
enum StarkEarnError {
    Unauthorized,
    InvalidState,
    InsufficientFunds,
    BountyNotFound,
    ApplicationNotFound,
    SubmissionNotFound,
    ReputationTooLow,
    SystemNotInitialized,
    DeadlinePassed,
}

// Common constants
const MAX_PLATFORM_FEE_BASIS_POINTS: u64 = 1000; // 10%
const DEFAULT_REPUTATION_SCORE: u64 = 100;
const MIN_REPUTATION_FOR_CREATION: u64 = 50;
const MIN_REPUTATION_FOR_APPLICATION: u64 = 25;

// Utility functions
fn calculate_platform_fee(amount: u256, basis_points: u64) -> u256 {
    (amount * basis_points) / 10000
}

fn is_valid_address(address: ContractAddress) -> bool {
    // Check if address is not zero
    address != 0.into()
}

fn validate_bounty_status(current: BountyStatus, expected: BountyStatus) -> bool {
    current == expected
}

fn get_current_timestamp() -> u64 {
    // This would get the current block timestamp
    // For now, returning a placeholder value
    1234567890
}

// Interface for interacting with the BountyRegistry
#[starknet::interface]
trait IBountyRegistryDispatcher {
    fn register_bounty(
        ref self: ContractState,
        bounty_address: ContractAddress,
        creator: ContractAddress
    ) -> u64;
    
    fn get_bounty_address(self: @ContractState, bounty_id: u64) -> ContractAddress;
    
    fn get_bounty_count(self: @ContractState) -> u64;
    
    fn get_global_stats(self: @ContractState) -> (u64, u64);
    
    fn update_completed_bounties(ref self: ContractState);
}

// Interface for interacting with the BountyFactory
#[starknet::interface]
trait IBountyFactoryDispatcher {
    fn create_bounty(
        ref self: ContractState,
        title: felt252,
        description: felt252,
        reward_amount: u256,
        deadline: u64,
        token_address: ContractAddress
    ) -> ContractAddress;
    
    fn set_registry_address(ref self: ContractState, registry_address: ContractAddress);
    
    fn set_bounty_class_hash(ref self: ContractState, class_hash: ClassHash);
}

// Interface for interacting with the PaymentProcessor
#[starknet::interface]
trait IPaymentProcessorDispatcher {
    fn deposit_escrow(ref self: ContractState, bounty_address: ContractAddress, amount: u256);
    
    fn process_payment(
        ref self: ContractState,
        bounty_address: ContractAddress,
        hunter: ContractAddress,
        amount: u256
    );
    
    fn process_refund(ref self: ContractState, bounty_address: ContractAddress, creator: ContractAddress, amount: u256);
    
    fn withdraw_platform_fees(ref self: ContractState, amount: u256, recipient: ContractAddress);
    
    fn get_escrow_balance(self: @ContractState, bounty_address: ContractAddress) -> u256;
    
    fn get_total_platform_fees(self: @ContractState) -> u256;
    
    fn set_platform_fee_basis_points(ref self: ContractState, basis_points: u64);
}

// Interface for interacting with the ReputationSystem
#[starknet::interface]
trait IReputationSystemDispatcher {
    fn register_user(ref self: ContractState, user: ContractAddress, initial_score: u64);
    
    fn update_reputation(
        ref self: ContractState,
        user: ContractAddress,
        is_creator: bool,
        is_completed: bool,
        quality_score: u64
    );
    
    fn get_user_reputation(self: @ContractState, user: ContractAddress) -> ReputationRecord;
    
    fn can_create_bounties(self: @ContractState, user: ContractAddress) -> bool;
    
    fn can_apply_for_bounties(self: @ContractState, user: ContractAddress) -> bool;
    
    fn get_total_users(self: @ContractState) -> u64;
    
    fn set_min_reputation_requirements(
        ref self: ContractState,
        for_creation: u64,
        for_application: u64
    );
}