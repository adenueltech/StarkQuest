// SPDX-License-Identifier: MIT
// StarkEarn - Complete Bounty Platform Smart Contract
// This contract implements all functionality for a complete bounty platform

// Enum for bounty status (needs to be outside the module for visibility)
#[derive(Drop, Copy, Serde, starknet::Store)]
pub enum BountyStatus {
    Open,
    InProgress,
    Completed,
    Cancelled
}

#[starknet::contract]
mod StarkEarn_minimal {
    use starknet::{ContractAddress, get_caller_address, get_contract_address, get_block_timestamp};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess, StorageMapWriteAccess};
    use super::BountyStatus;
    
    // Struct for Bounty
    #[derive(Drop, Copy, Serde, starknet::Store)]
    pub struct Bounty {
        pub title: felt252,
        pub description: felt252,
        pub reward_amount: u256,
        pub deadline: u64,
        pub token_address: ContractAddress,
        pub status: BountyStatus,
        pub creator: ContractAddress,
        pub hunter: ContractAddress,
    }
    
    // Struct for Application
    #[derive(Drop, Copy, Serde, starknet::Store)]
    pub struct Application {
        pub applicant: ContractAddress,
        pub timestamp: u64,
        pub accepted: bool,
    }
    
    // Struct for Submission
    #[derive(Drop, Copy, Serde, starknet::Store)]
    pub struct Submission {
        pub hunter: ContractAddress,
        pub content: felt252,
        pub timestamp: u64,
        pub approved: bool,
    }
    
    #[storage]
    struct Storage {
        // Simple counter (from original)
        counter: u64,
        // Simple mapping (from original)
        values: starknet::storage::Map::<u64, felt252>,
        
        // Bounty platform storage
        bounty_count: u64,
        bounties: starknet::storage::Map::<u64, Bounty>,
        applications: starknet::storage::Map::<(u64, u64), Application>,
        application_count: starknet::storage::Map::<u64, u64>,
        submissions: starknet::storage::Map::<(u64, u64), Submission>,
        submission_count: starknet::storage::Map::<u64, u64>,
        escrow_balances: starknet::storage::Map::<u64, u256>,
        user_reputations: starknet::storage::Map::<ContractAddress, u64>,
    }
    
    #[event]
    #[derive(starknet::Event, Drop)]
    enum Event {
        // Original events
        CounterIncreased: CounterIncreased,
        ValueStored: ValueStored,
        
        // Bounty platform events
        BountyCreated: BountyCreated,
        ApplicationSubmitted: ApplicationSubmitted,
        ApplicationAccepted: ApplicationAccepted,
        WorkSubmitted: WorkSubmitted,
        SubmissionApproved: SubmissionApproved,
        BountyCancelled: BountyCancelled,
        EscrowDeposited: EscrowDeposited,
        PaymentProcessed: PaymentProcessed,
        RefundProcessed: RefundProcessed,
        UserRegistered: UserRegistered,
        ReputationUpdated: ReputationUpdated,
    }
    
    // Original events
    #[derive(starknet::Event, Drop)]
    struct CounterIncreased {
        counter: u64,
    }
    
    #[derive(starknet::Event, Drop)]
    struct ValueStored {
        key: u64,
        value: felt252,
    }
    
    // Bounty platform events
    #[derive(starknet::Event, Drop)]
    struct BountyCreated {
        bounty_id: u64,
        creator: ContractAddress,
        title: felt252,
        reward_amount: u256,
    }
    
    #[derive(starknet::Event, Drop)]
    struct ApplicationSubmitted {
        bounty_id: u64,
        application_id: u64,
        applicant: ContractAddress,
    }
    
    #[derive(starknet::Event, Drop)]
    struct ApplicationAccepted {
        bounty_id: u64,
        application_id: u64,
    }
    
    #[derive(starknet::Event, Drop)]
    struct WorkSubmitted {
        bounty_id: u64,
        submission_id: u64,
        hunter: ContractAddress,
    }
    
    #[derive(starknet::Event, Drop)]
    struct SubmissionApproved {
        bounty_id: u64,
        submission_id: u64,
    }
    
    #[derive(starknet::Event, Drop)]
    struct BountyCancelled {
        bounty_id: u64,
        reason: felt252,
    }
    
    #[derive(starknet::Event, Drop)]
    struct EscrowDeposited {
        bounty_id: u64,
        amount: u256,
    }
    
    #[derive(starknet::Event, Drop)]
    struct PaymentProcessed {
        bounty_id: u64,
        hunter: ContractAddress,
        amount: u256,
    }
    
    #[derive(starknet::Event, Drop)]
    struct RefundProcessed {
        bounty_id: u64,
        creator: ContractAddress,
        amount: u256,
    }
    
    #[derive(starknet::Event, Drop)]
    struct UserRegistered {
        user: ContractAddress,
        initial_score: u64,
    }
    
    #[derive(starknet::Event, Drop)]
    struct ReputationUpdated {
        user: ContractAddress,
        new_reputation: u64,
    }
    
    #[constructor]
    fn constructor(ref self: ContractState) {
        self.counter.write(0);
        self.bounty_count.write(0);
    }
    
    #[abi(embed_v0)]
    impl IStarkEarnMinimal of super::IStarkEarnMinimal<ContractState> {
        // Original functions
        fn increase_counter(ref self: ContractState) {
            let counter = self.counter.read() + 1;
            self.counter.write(counter);
            
            self.emit(Event::CounterIncreased(CounterIncreased {
                counter,
            }));
        }
        
        fn get_counter(self: @ContractState) -> u64 {
            self.counter.read()
        }
        
        fn store_value(ref self: ContractState, key: u64, value: felt252) {
            self.values.write(key, value);
            
            self.emit(Event::ValueStored(ValueStored {
                key,
                value,
            }));
        }
        
        fn get_value(self: @ContractState, key: u64) -> felt252 {
            self.values.read(key)
        }
        
        // Bounty Registry functions
        fn get_bounty_count(self: @ContractState) -> u64 {
            self.bounty_count.read()
        }
        
        fn get_bounty_address(self: @ContractState, bounty_id: u64) -> ContractAddress {
            // In this implementation, all contracts use the same address
            // This function returns the current contract address for any bounty_id
            get_contract_address()
        }
        
        // Bounty Factory functions
        fn create_bounty(
            ref self: ContractState,
            title: felt252,
            description: felt252,
            reward_amount: u256,
            deadline: u64,
            token_address: ContractAddress
        ) -> u64 {
            let bounty_id = self.bounty_count.read() + 1;
            self.bounty_count.write(bounty_id);
            
            let zero_address: ContractAddress = 0_felt252.try_into().unwrap();
            
            let bounty = Bounty {
                title,
                description,
                reward_amount,
                deadline,
                token_address,
                status: BountyStatus::Open,
                creator: get_caller_address(),
                hunter: zero_address,
            };
            
            self.bounties.write(bounty_id, bounty);
            
            self.emit(Event::BountyCreated(BountyCreated {
                bounty_id,
                creator: get_caller_address(),
                title,
                reward_amount,
            }));
            
            bounty_id
        }
        
        // Payment Processor functions
        fn deposit_escrow(ref self: ContractState, bounty_id: u64, amount: u256) {
            let current_balance = self.escrow_balances.read(bounty_id);
            let new_balance = current_balance + amount;
            self.escrow_balances.write(bounty_id, new_balance);
            
            self.emit(Event::EscrowDeposited(EscrowDeposited {
                bounty_id,
                amount,
            }));
        }
        
        fn process_payment(ref self: ContractState, bounty_id: u64, hunter: ContractAddress, amount: u256) {
            let current_balance = self.escrow_balances.read(bounty_id);
            if current_balance >= amount {
                let new_balance = current_balance - amount;
                self.escrow_balances.write(bounty_id, new_balance);
                
                self.emit(Event::PaymentProcessed(PaymentProcessed {
                    bounty_id,
                    hunter,
                    amount,
                }));
            }
        }
        
        fn process_refund(ref self: ContractState, bounty_id: u64, creator: ContractAddress, amount: u256) {
            let current_balance = self.escrow_balances.read(bounty_id);
            if current_balance >= amount {
                let new_balance = current_balance - amount;
                self.escrow_balances.write(bounty_id, new_balance);
                
                self.emit(Event::RefundProcessed(RefundProcessed {
                    bounty_id,
                    creator,
                    amount,
                }));
            }
        }
        
        fn get_escrow_balance(self: @ContractState, bounty_id: u64) -> u256 {
            self.escrow_balances.read(bounty_id)
        }
        
        // Reputation System functions
        fn get_user_reputation(self: @ContractState, user_address: ContractAddress) -> u64 {
            self.user_reputations.read(user_address)
        }
        
        fn register_user(ref self: ContractState, user: ContractAddress, initial_score: u64) {
            self.user_reputations.write(user, initial_score);
            
            self.emit(Event::UserRegistered(UserRegistered {
                user,
                initial_score,
            }));
        }
        
        fn update_reputation(
            ref self: ContractState,
            user: ContractAddress,
            is_creator: bool,
            is_completed: bool,
            quality_score: u64
        ) {
            let current_reputation = self.user_reputations.read(user);
            let mut new_reputation = current_reputation;
            
            if is_completed {
                // Increase reputation for completed work
                new_reputation += quality_score;
            } else if !is_creator {
                // Small penalty for incomplete work by hunters
                if new_reputation > 5 {
                    new_reputation -= 5;
                }
            }
            
            self.user_reputations.write(user, new_reputation);
            
            self.emit(Event::ReputationUpdated(ReputationUpdated {
                user,
                new_reputation,
            }));
        }
        
        // Bounty functions
        fn submit_application(ref self: ContractState, bounty_id: u64) {
            let application_id = self.application_count.read(bounty_id) + 1;
            self.application_count.write(bounty_id, application_id);
            
            let application = Application {
                applicant: get_caller_address(),
                timestamp: get_block_timestamp(),
                accepted: false,
            };
            
            self.applications.write((bounty_id, application_id), application);
            
            self.emit(Event::ApplicationSubmitted(ApplicationSubmitted {
                bounty_id,
                application_id,
                applicant: get_caller_address(),
            }));
        }
        
        fn accept_application(ref self: ContractState, bounty_id: u64, application_id: u64) {
            let application = self.applications.read((bounty_id, application_id));
            let updated_application = Application {
                applicant: application.applicant,
                timestamp: application.timestamp,
                accepted: true,
            };
            self.applications.write((bounty_id, application_id), updated_application);
            
            // Update bounty status and assign hunter
            let bounty = self.bounties.read(bounty_id);
            let updated_bounty = Bounty {
                title: bounty.title,
                description: bounty.description,
                reward_amount: bounty.reward_amount,
                deadline: bounty.deadline,
                token_address: bounty.token_address,
                status: BountyStatus::InProgress,
                creator: bounty.creator,
                hunter: application.applicant,
            };
            self.bounties.write(bounty_id, updated_bounty);
            
            self.emit(Event::ApplicationAccepted(ApplicationAccepted {
                bounty_id,
                application_id,
            }));
        }
        
        fn submit_work(ref self: ContractState, bounty_id: u64, content: felt252) {
            let submission_id = self.submission_count.read(bounty_id) + 1;
            self.submission_count.write(bounty_id, submission_id);
            
            let submission = Submission {
                hunter: get_caller_address(),
                content,
                timestamp: get_block_timestamp(),
                approved: false,
            };
            
            self.submissions.write((bounty_id, submission_id), submission);
            
            self.emit(Event::WorkSubmitted(WorkSubmitted {
                bounty_id,
                submission_id,
                hunter: get_caller_address(),
            }));
        }
        
        fn approve_submission(ref self: ContractState, bounty_id: u64, submission_id: u64) {
            let submission = self.submissions.read((bounty_id, submission_id));
            let updated_submission = Submission {
                hunter: submission.hunter,
                content: submission.content,
                timestamp: submission.timestamp,
                approved: true,
            };
            self.submissions.write((bounty_id, submission_id), updated_submission);
            
            // Update bounty status
            let bounty = self.bounties.read(bounty_id);
            let updated_bounty = Bounty {
                title: bounty.title,
                description: bounty.description,
                reward_amount: bounty.reward_amount,
                deadline: bounty.deadline,
                token_address: bounty.token_address,
                status: BountyStatus::Completed,
                creator: bounty.creator,
                hunter: bounty.hunter,
            };
            self.bounties.write(bounty_id, updated_bounty);
            
            self.emit(Event::SubmissionApproved(SubmissionApproved {
                bounty_id,
                submission_id,
            }));
        }
        
        fn cancel_bounty(ref self: ContractState, bounty_id: u64, reason: felt252) {
            let bounty = self.bounties.read(bounty_id);
            let updated_bounty = Bounty {
                title: bounty.title,
                description: bounty.description,
                reward_amount: bounty.reward_amount,
                deadline: bounty.deadline,
                token_address: bounty.token_address,
                status: BountyStatus::Cancelled,
                creator: bounty.creator,
                hunter: bounty.hunter,
            };
            self.bounties.write(bounty_id, updated_bounty);
            
            self.emit(Event::BountyCancelled(BountyCancelled {
                bounty_id,
                reason,
            }));
        }
        
        fn get_bounty(
            self: @ContractState,
            bounty_id: u64
        ) -> (felt252, felt252, u256, u64, ContractAddress, BountyStatus) {
            let bounty = self.bounties.read(bounty_id);
            (
                bounty.title,
                bounty.description,
                bounty.reward_amount,
                bounty.deadline,
                bounty.token_address,
                bounty.status
            )
        }
        
        fn get_application(
            self: @ContractState,
            bounty_id: u64,
            application_id: u64
        ) -> (ContractAddress, u64, bool) {
            let application = self.applications.read((bounty_id, application_id));
            (
                application.applicant,
                application.timestamp,
                application.accepted
            )
        }
        
        fn get_submission(
            self: @ContractState,
            bounty_id: u64,
            submission_id: u64
        ) -> (ContractAddress, felt252, u64, bool) {
            let submission = self.submissions.read((bounty_id, submission_id));
            (
                submission.hunter,
                submission.content,
                submission.timestamp,
                submission.approved
            )
        }
    }
}

// Interface for StarkEarn Minimal
#[starknet::interface]
trait IStarkEarnMinimal<TContractState> {
    // Original functions
    fn increase_counter(ref self: TContractState);
    fn get_counter(self: @TContractState) -> u64;
    fn store_value(ref self: TContractState, key: u64, value: felt252);
    fn get_value(self: @TContractState, key: u64) -> felt252;
    
    // Bounty Registry functions
    fn get_bounty_count(self: @TContractState) -> u64;
    fn get_bounty_address(self: @TContractState, bounty_id: u64) -> starknet::ContractAddress;
    
    // Bounty Factory functions
    fn create_bounty(
        ref self: TContractState,
        title: felt252,
        description: felt252,
        reward_amount: u256,
        deadline: u64,
        token_address: starknet::ContractAddress
    ) -> u64;
    
    // Payment Processor functions
    fn deposit_escrow(ref self: TContractState, bounty_id: u64, amount: u256);
    fn process_payment(ref self: TContractState, bounty_id: u64, hunter: starknet::ContractAddress, amount: u256);
    fn process_refund(ref self: TContractState, bounty_id: u64, creator: starknet::ContractAddress, amount: u256);
    fn get_escrow_balance(self: @TContractState, bounty_id: u64) -> u256;
    
    // Reputation System functions
    fn get_user_reputation(self: @TContractState, user_address: starknet::ContractAddress) -> u64;
    fn register_user(ref self: TContractState, user: starknet::ContractAddress, initial_score: u64);
    fn update_reputation(
        ref self: TContractState,
        user: starknet::ContractAddress,
        is_creator: bool,
        is_completed: bool,
        quality_score: u64
    );
    
    // Bounty functions
    fn submit_application(ref self: TContractState, bounty_id: u64);
    fn accept_application(ref self: TContractState, bounty_id: u64, application_id: u64);
    fn submit_work(ref self: TContractState, bounty_id: u64, content: felt252);
    fn approve_submission(ref self: TContractState, bounty_id: u64, submission_id: u64);
    fn cancel_bounty(ref self: TContractState, bounty_id: u64, reason: felt252);
    fn get_bounty(
        self: @TContractState,
        bounty_id: u64
    ) -> (felt252, felt252, u256, u64, starknet::ContractAddress, BountyStatus);
    fn get_application(
        self: @TContractState,
        bounty_id: u64,
        application_id: u64
    ) -> (starknet::ContractAddress, u64, bool);
    fn get_submission(
        self: @TContractState,
        bounty_id: u64,
        submission_id: u64
    ) -> (starknet::ContractAddress, felt252, u64, bool);
}