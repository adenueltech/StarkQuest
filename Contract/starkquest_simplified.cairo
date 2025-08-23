// SPDX-License-Identifier: MIT
// StarkQuest - Simplified Smart Contract
// This is a simplified version of the StarkQuest smart contract system
// that combines essential functionality into a single contract

#[starknet::contract]
mod starkquest_simplified {
    use starknet::ContractAddress;
    use starknet::get_contract_address;
    use starknet::storage::{StoragePointerRead, StoragePointerWrite};
    
    // Bounty status enum
    #[derive(Drop, Copy, PartialEq)]
    enum BountyStatus {
        Open,
        InProgress,
        Completed,
        Cancelled,
    }
    
    // Application structure
    #[derive(Drop, Copy)]
    struct Application {
        applicant: ContractAddress,
        timestamp: u64,
        accepted: bool,
    }
    
    // Submission structure
    #[derive(Drop, Copy)]
    struct Submission {
        hunter: ContractAddress,
        content: felt252,
        timestamp: u64,
        approved: bool,
    }
    
    // Reputation record structure
    #[derive(Drop, Copy)]
    struct ReputationRecord {
        score: u64,
        bounty_count: u64,
        completed_count: u64,
    }
    
    #[storage]
    struct Storage {
        // Bounty details
        bounties: LegacyMap::<u64, (felt252, felt252, u256, u64, ContractAddress, BountyStatus)>,
        // Applications for each bounty
        applications: LegacyMap::<u64, LegacyMap::<u64, Application>>,
        // Submissions for each bounty
        submissions: LegacyMap::<u64, LegacyMap::<u64, Submission>>,
        // Assigned hunters for each bounty
        assigned_hunters: LegacyMap::<u64, ContractAddress>,
        
        // Bounty counters
        bounty_count: u64,
        application_counts: LegacyMap::<u64, u64>,
        submission_counts: LegacyMap::<u64, u64>,
        
        // Reputation records for users
        user_reputations: LegacyMap::<ContractAddress, ReputationRecord>,
        
        // Platform fee settings
        platform_fee_basis_points: u64,
        total_platform_fees: u256,
        
        // Escrow balances for bounties
        escrow_balances: LegacyMap::<u64, u256>,
        
        // Owner of the contract
        owner: ContractAddress,
    }
    
    #[event]
    #[derive(starknet::Event)]
    enum Event {
        BountyCreated: BountyCreated,
        ApplicationSubmitted: ApplicationSubmitted,
        ApplicationAccepted: ApplicationAccepted,
        SubmissionSubmitted: SubmissionSubmitted,
        SubmissionApproved: SubmissionApproved,
        BountyCompleted: BountyCompleted,
        BountyCancelled: BountyCancelled,
        PaymentProcessed: PaymentProcessed,
        ReputationUpdated: ReputationUpdated,
    }
    
    #[derive(starknet::Event)]
    struct BountyCreated {
        bounty_id: u64,
        creator: ContractAddress,
        title: felt252,
        reward_amount: u256,
    }
    
    #[derive(starknet::Event)]
    struct ApplicationSubmitted {
        bounty_id: u64,
        applicant: ContractAddress,
        timestamp: u64,
    }
    
    #[derive(starknet::Event)]
    struct ApplicationAccepted {
        bounty_id: u64,
        applicant: ContractAddress,
        timestamp: u64,
    }
    
    #[derive(starknet::Event)]
    struct SubmissionSubmitted {
        bounty_id: u64,
        hunter: ContractAddress,
        content: felt252,
        timestamp: u64,
    }
    
    #[derive(starknet::Event)]
    struct SubmissionApproved {
        bounty_id: u64,
        hunter: ContractAddress,
        timestamp: u64,
    }
    
    #[derive(starknet::Event)]
    struct BountyCompleted {
        bounty_id: u64,
        hunter: ContractAddress,
        reward_amount: u256,
    }
    
    #[derive(starknet::Event)]
    struct BountyCancelled {
        bounty_id: u64,
        reason: felt252,
    }
    
    #[derive(starknet::Event)]
    struct PaymentProcessed {
        bounty_id: u64,
        hunter: ContractAddress,
        amount: u256,
        platform_fee: u256,
    }
    
    #[derive(starknet::Event)]
    struct ReputationUpdated {
        user: ContractAddress,
        old_score: u64,
        new_score: u64,
        reason: felt252,
    }
    
    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
        self.bounty_count.write(0);
        self.platform_fee_basis_points.write(100); // 1% platform fee
        self.total_platform_fees.write(0);
    }
    
    // External functions
    #[external(v0)]
    impl IStarkQuestSimplified of super::IStarkQuestSimplified {
        // Create a new bounty
        fn create_bounty(
            ref self: ContractState,
            title: felt252,
            description: felt252,
            reward_amount: u256,
            deadline: u64,
            token_address: ContractAddress
        ) -> u64 {
            // Check if user has sufficient reputation to create bounties
            let creator_reputation = self.get_user_reputation(self.sender_address());
            assert(creator_reputation.score >= 50, 'Insufficient reputation to create bounties');
            
            // Increment bounty count
            let bounty_id = self.bounty_count.read() + 1;
            self.bounty_count.write(bounty_id);
            
            // Store bounty details
            self.bounties.write(bounty_id, (title, description, reward_amount, deadline, token_address, BountyStatus::Open));
            
            // Initialize counters
            self.application_counts.write(bounty_id, 0);
            self.submission_counts.write(bounty_id, 0);
            
            // Initialize escrow balance
            self.escrow_balances.write(bounty_id, reward_amount);
            
            // Emit event
            self.emit(Event::BountyCreated(BountyCreated {
                bounty_id,
                creator: self.sender_address(),
                title,
                reward_amount,
            }));
            
            bounty_id
        }
        
        // Submit an application for a bounty
        fn submit_application(ref self: ContractState, bounty_id: u64) {
            // Get bounty details
            let (_, _, _, deadline, _, status) = self.bounties.read(bounty_id);
            
            // Check if bounty is open
            assert(status == BountyStatus::Open, 'Bounty is not open for applications');
            
            // Check if deadline has passed
            assert(self.get_block_timestamp() < deadline, 'Bounty deadline has passed');
            
            // Check if user has sufficient reputation to apply
            let applicant_reputation = self.get_user_reputation(self.sender_address());
            assert(applicant_reputation.score >= 25, 'Insufficient reputation to apply for bounties');
            
            // Create application
            let application_id = self.application_counts.read(bounty_id) + 1;
            self.application_counts.write(bounty_id, application_id);
            
            let application = Application {
                applicant: self.sender_address(),
                timestamp: self.get_block_timestamp(),
                accepted: false,
            };
            
            self.applications.write(bounty_id, application_id, application);
            
            // Emit event
            self.emit(Event::ApplicationSubmitted(ApplicationSubmitted {
                bounty_id,
                applicant: self.sender_address(),
                timestamp: self.get_block_timestamp(),
            }));
        }
        
        // Accept an application
        fn accept_application(ref self: ContractState, bounty_id: u64, application_id: u64) {
            // Get bounty details
            let (_, _, _, _, _, status) = self.bounties.read(bounty_id);
            
            // Check if bounty is open
            assert(status == BountyStatus::Open, 'Bounty is not open for applications');
            
            // Check if sender is the bounty creator
            let (_, _, _, _, creator, _) = self.bounties.read(bounty_id);
            assert(self.sender_address() == creator, 'Only creator can accept applications');
            
            // Get application
            let mut application = self.applications.read(bounty_id, application_id);
            assert(!application.accepted, 'Application already accepted');
            
            // Accept application
            application.accepted = true;
            self.applications.write(bounty_id, application_id, application);
            
            // Update bounty status and assigned hunter
            let (_, description, reward_amount, deadline, token_address, _) = self.bounties.read(bounty_id);
            self.bounties.write(bounty_id, (description, description, reward_amount, deadline, token_address, BountyStatus::InProgress));
            self.assigned_hunters.write(bounty_id, application.applicant);
            
            // Emit event
            self.emit(Event::ApplicationAccepted(ApplicationAccepted {
                bounty_id,
                applicant: application.applicant,
                timestamp: self.get_block_timestamp(),
            }));
        }
        
        // Submit work for a bounty
        fn submit_work(ref self: ContractState, bounty_id: u64, content: felt252) {
            // Get bounty details
            let (_, _, _, _, _, status) = self.bounties.read(bounty_id);
            
            // Check if bounty is in progress
            assert(status == BountyStatus::InProgress, 'Bounty is not in progress');
            
            // Check if sender is the assigned hunter
            let assigned_hunter = self.assigned_hunters.read(bounty_id);
            assert(self.sender_address() == assigned_hunter, 'Only assigned hunter can submit work');
            
            // Get deadline
            let (_, _, _, deadline, _, _) = self.bounties.read(bounty_id);
            
            // Check if deadline has passed
            assert(self.get_block_timestamp() < deadline, 'Bounty deadline has passed');
            
            // Create submission
            let submission_id = self.submission_counts.read(bounty_id) + 1;
            self.submission_counts.write(bounty_id, submission_id);
            
            let submission = Submission {
                hunter: self.sender_address(),
                content: content,
                timestamp: self.get_block_timestamp(),
                approved: false,
            };
            
            self.submissions.write(bounty_id, submission_id, submission);
            
            // Emit event
            self.emit(Event::SubmissionSubmitted(SubmissionSubmitted {
                bounty_id,
                hunter: self.sender_address(),
                content: content,
                timestamp: self.get_block_timestamp(),
            }));
        }
        
        // Approve submission
        fn approve_submission(ref self: ContractState, bounty_id: u64, submission_id: u64) {
            // Get bounty details
            let (_, _, _, _, _, status) = self.bounties.read(bounty_id);
            
            // Check if bounty is in progress
            assert(status == BountyStatus::InProgress, 'Bounty is not in progress');
            
            // Check if sender is the bounty creator
            let (_, _, _, _, creator, _) = self.bounties.read(bounty_id);
            assert(self.sender_address() == creator, 'Only creator can approve submissions');
            
            // Get submission
            let mut submission = self.submissions.read(bounty_id, submission_id);
            assert(!submission.approved, 'Submission already approved');
            
            // Approve submission
            submission.approved = true;
            self.submissions.write(bounty_id, submission_id, submission);
            
            // Update bounty status
            let (title, description, reward_amount, deadline, token_address, _) = self.bounties.read(bounty_id);
            self.bounties.write(bounty_id, (title, description, reward_amount, deadline, token_address, BountyStatus::Completed));
            
            // Process payment
            self.process_payment(bounty_id, submission.hunter, reward_amount);
            
            // Update reputation
            self.update_reputation(submission.hunter, false, true, 80); // Hunter completed with 80 quality score
            self.update_reputation(creator, true, true, 90); // Creator completed with 90 quality score
            
            // Emit events
            self.emit(Event::SubmissionApproved(SubmissionApproved {
                bounty_id,
                hunter: submission.hunter,
                timestamp: self.get_block_timestamp(),
            }));
            
            self.emit(Event::BountyCompleted(BountyCompleted {
                bounty_id,
                hunter: submission.hunter,
                reward_amount,
            }));
        }
        
        // Cancel bounty
        fn cancel_bounty(ref self: ContractState, bounty_id: u64, reason: felt252) {
            // Get bounty details
            let (_, _, _, _, _, status) = self.bounties.read(bounty_id);
            
            // Check if bounty can be cancelled
            assert(
                status == BountyStatus::Open || status == BountyStatus::InProgress,
                'Bounty cannot be cancelled'
            );
            
            // Check if sender is the bounty creator
            let (_, _, _, _, creator, _) = self.bounties.read(bounty_id);
            assert(self.sender_address() == creator, 'Only creator can cancel bounty');
            
            // Update bounty status
            let (title, description, reward_amount, deadline, token_address, _) = self.bounties.read(bounty_id);
            self.bounties.write(bounty_id, (title, description, reward_amount, deadline, token_address, BountyStatus::Cancelled));
            
            // Process refund
            self.process_refund(bounty_id, creator, reward_amount);
            
            // Emit event
            self.emit(Event::BountyCancelled(BountyCancelled {
                bounty_id,
                reason: reason,
            }));
        }
        
        // Register a new user with initial reputation
        fn register_user(ref self: ContractState, user: ContractAddress, initial_score: u64) {
            // Only owner can register users
            assert(self.sender_address() == self.owner.read(), 'Only owner can register users');
            
            // Check if user already has reputation
            let existing_record = self.user_reputations.read(user);
            assert(existing_record.score == 0, 'User already registered');
            
            // Create reputation record
            let record = ReputationRecord {
                score: initial_score,
                bounty_count: 0,
                completed_count: 0,
            };
            
            self.user_reputations.write(user, record);
        }
        
        // Update user reputation
        fn update_reputation(
            ref self: ContractState,
            user: ContractAddress,
            is_creator: bool,
            is_completed: bool,
            quality_score: u64
        ) {
            // Only owner can update reputation
            assert(self.sender_address() == self.owner.read(), 'Only owner can update reputation');
            
            // Get current reputation record
            let mut record = self.user_reputations.read(user);
            
            // Store old score for event
            let old_score = record.score;
            
            // Update bounty counts
            record.bounty_count += 1;
            if is_completed {
                record.completed_count += 1;
            }
            
            // Calculate reputation change
            let reputation_change = if is_completed {
                // Completed bounties increase reputation
                // Quality score affects the amount (1-100)
                (quality_score * 10) / 100  // 0-10 points based on quality
            } else {
                // Failed bounties decrease reputation
                if is_creator {
                    // Creators lose more reputation for failing bounties
                    5
                } else {
                    // Hunters lose less reputation for not completing
                    2
                }
            };
            
            // Update score (ensure it doesn't go below 0)
            if record.score > reputation_change {
                record.score = record.score - reputation_change;
            } else {
                record.score = 0;
            }
            
            // Apply positive changes
            if reputation_change > 0 {
                record.score = record.score + reputation_change;
            }
            
            // Update record
            self.user_reputations.write(user, record);
            
            // Emit event
            let reason = if is_creator {
                if is_completed { 'creator_completed' } else { 'creator_failed' }
            } else {
                if is_completed { 'hunter_completed' } else { 'hunter_failed' }
            };
            
            self.emit(Event::ReputationUpdated(ReputationUpdated {
                user: user,
                old_score: old_score,
                new_score: record.score,
                reason: reason,
            }));
        }
        
        // Get bounty details
        fn get_bounty(self: @ContractState, bounty_id: u64) -> (felt252, felt252, u256, u64, ContractAddress, BountyStatus) {
            self.bounties.read(bounty_id)
        }
        
        // Get application
        fn get_application(self: @ContractState, bounty_id: u64, application_id: u64) -> Application {
            self.applications.read(bounty_id, application_id)
        }
        
        // Get submission
        fn get_submission(self: @ContractState, bounty_id: u64, submission_id: u64) -> Submission {
            self.submissions.read(bounty_id, submission_id)
        }
        
        // Get user reputation
        fn get_user_reputation(self: @ContractState, user: ContractAddress) -> ReputationRecord {
            self.user_reputations.read(user)
        }
        
        // Get total number of bounties
        fn get_bounty_count(self: @ContractState) -> u64 {
            self.bounty_count.read()
        }
        
        // Get escrow balance for a bounty
        fn get_escrow_balance(self: @ContractState, bounty_id: u64) -> u256 {
            self.escrow_balances.read(bounty_id)
        }
        
        // Set platform fee percentage
        fn set_platform_fee_basis_points(ref self: ContractState, basis_points: u64) {
            assert(self.sender_address() == self.owner.read(), 'Only owner can set fee');
            assert(basis_points <= 10000, 'Fee cannot exceed 100%');
            self.platform_fee_basis_points.write(basis_points);
        }
    }
    
    // Internal functions
    fn process_payment(self: @ContractState, bounty_id: u64, hunter: ContractAddress, amount: u256) {
        // Calculate platform fee
        let basis_points = self.platform_fee_basis_points.read();
        let platform_fee = (amount * basis_points) / 10000;
        let hunter_amount = amount - platform_fee;
        
        // Update escrow balance
        let current_balance = self.escrow_balances.read(bounty_id);
        assert(current_balance >= amount, 'Insufficient escrow balance');
        let new_balance = current_balance - amount;
        self.escrow_balances.write(bounty_id, new_balance);
        
        // Update platform fees collected
        let total_fees = self.total_platform_fees.read() + platform_fee;
        self.total_platform_fees.write(total_fees);
        
        // In a real implementation, we would transfer tokens here
        // For now, we'll just emit an event
        
        // Emit event
        self.emit(Event::PaymentProcessed(PaymentProcessed {
            bounty_id,
            hunter,
            amount: hunter_amount,
            platform_fee,
        }));
    }
    
    fn process_refund(self: @ContractState, bounty_id: u64, creator: ContractAddress, amount: u256) {
        // Update escrow balance
        let current_balance = self.escrow_balances.read(bounty_id);
        assert(current_balance >= amount, 'Insufficient escrow balance');
        let new_balance = current_balance - amount;
        self.escrow_balances.write(bounty_id, new_balance);
        
        // In a real implementation, we would transfer tokens here
        // For now, we'll just emit an event
    }
    
    fn get_block_timestamp(self: @ContractState) -> u64 {
        // This would get the current block timestamp
        // For now, returning a placeholder value
        1234567890
    }
}

// Interface for StarkQuest Simplified
#[starknet::interface]
trait IStarkQuestSimplified {
    fn create_bounty(
        ref self: ContractState,
        title: felt252,
        description: felt252,
        reward_amount: u256,
        deadline: u64,
        token_address: ContractAddress
    ) -> u64;
    
    fn submit_application(ref self: ContractState, bounty_id: u64);
    
    fn accept_application(ref self: ContractState, bounty_id: u64, application_id: u64);
    
    fn submit_work(ref self: ContractState, bounty_id: u64, content: felt252);
    
    fn approve_submission(ref self: ContractState, bounty_id: u64, submission_id: u64);
    
    fn cancel_bounty(ref self: ContractState, bounty_id: u64, reason: felt252);
    
    fn register_user(ref self: ContractState, user: ContractAddress, initial_score: u64);
    
    fn update_reputation(
        ref self: ContractState,
        user: ContractAddress,
        is_creator: bool,
        is_completed: bool,
        quality_score: u64
    );
    
    fn get_bounty(self: @ContractState, bounty_id: u64) -> (felt252, felt252, u256, u64, ContractAddress, super::starkquest_simplified::BountyStatus);
    
    fn get_application(self: @ContractState, bounty_id: u64, application_id: u64) -> super::starkquest_simplified::Application;
    
    fn get_submission(self: @ContractState, bounty_id: u64, submission_id: u64) -> super::starkquest_simplified::Submission;
    
    fn get_user_reputation(self: @ContractState, user: ContractAddress) -> super::starkquest_simplified::ReputationRecord;
    
    fn get_bounty_count(self: @ContractState) -> u64;
    
    fn get_escrow_balance(self: @ContractState, bounty_id: u64) -> u256;
    
    fn set_platform_fee_basis_points(ref self: ContractState, basis_points: u64);
}