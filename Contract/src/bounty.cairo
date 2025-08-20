// StarkEarn - Bounty Contract
// Individual bounty contract with all functionality

#[starknet::contract]
mod bounty {
    use starknet::ContractAddress;
    use starknet::SyscallResultTrait;
    use starknet::get_contract_address;
    use starknet::storage::{StoragePointerRead, StoragePointerWrite};
    use starknet::library_call_syscall;
    
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
    
    #[storage]
    struct Storage {
        // Bounty details
        title: felt252,
        description: felt252,
        reward_amount: u256,
        deadline: u64,
        token_address: ContractAddress,
        creator: ContractAddress,
        status: BountyStatus,
        
        // Applications
        applications: LegacyMap::<u64, Application>,
        application_count: u64,
        
        // Submissions
        submissions: LegacyMap::<u64, Submission>,
        submission_count: u64,
        
        // Assigned hunter
        assigned_hunter: ContractAddress,
        
        // Payment processor address
        payment_processor: ContractAddress,
        
        // Reputation system address
        reputation_system: ContractAddress,
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
    }
    
    #[derive(starknet::Event)]
    struct BountyCreated {
        bounty_address: ContractAddress,
        creator: ContractAddress,
        title: felt252,
        reward_amount: u256,
    }
    
    #[derive(starknet::Event)]
    struct ApplicationSubmitted {
        applicant: ContractAddress,
        timestamp: u64,
    }
    
    #[derive(starknet::Event)]
    struct ApplicationAccepted {
        applicant: ContractAddress,
        timestamp: u64,
    }
    
    #[derive(starknet::Event)]
    struct SubmissionSubmitted {
        hunter: ContractAddress,
        content: felt252,
        timestamp: u64,
    }
    
    #[derive(starknet::Event)]
    struct SubmissionApproved {
        hunter: ContractAddress,
        timestamp: u64,
    }
    
    #[derive(starknet::Event)]
    struct BountyCompleted {
        bounty_address: ContractAddress,
        hunter: ContractAddress,
        reward_amount: u256,
    }
    
    #[derive(starknet::Event)]
    struct BountyCancelled {
        bounty_address: ContractAddress,
        reason: felt252,
    }
    
    #[constructor]
    fn constructor(
        ref self: ContractState,
        title: felt252,
        description: felt252,
        reward_amount: u256,
        deadline: u64,
        token_address: ContractAddress,
        creator: ContractAddress,
        payment_processor: ContractAddress,
        reputation_system: ContractAddress
    ) {
        self.title.write(title);
        self.description.write(description);
        self.reward_amount.write(reward_amount);
        self.deadline.write(deadline);
        self.token_address.write(token_address);
        self.creator.write(creator);
        self.status.write(BountyStatus::Open);
        self.application_count.write(0);
        self.submission_count.write(0);
        self.payment_processor.write(payment_processor);
        self.reputation_system.write(reputation_system);
    }
    
    #[external(v0)]
    impl IBounty of super::IBounty {
        // Submit an application for this bounty
        fn submit_application(ref self: ContractState) {
            assert(self.status.read() == BountyStatus::Open, 'Bounty is not open for applications');
            
            // Check if deadline has passed
            assert(self.get_block_timestamp() < self.deadline.read(), 'Bounty deadline has passed');
            
            // Create application
            let application_id = self.application_count.read() + 1;
            self.application_count.write(application_id);
            
            let application = Application {
                applicant: self.sender_address(),
                timestamp: self.get_block_timestamp(),
                accepted: false,
            };
            
            self.applications.write(application_id, application);
            
            // Emit event
            self.emit(Event::ApplicationSubmitted(ApplicationSubmitted {
                applicant: self.sender_address(),
                timestamp: self.get_block_timestamp(),
            }));
        }
        
        // Accept an application
        fn accept_application(ref self: ContractState, application_id: u64) {
            assert(self.sender_address() == self.creator.read(), 'Only creator can accept applications');
            assert(self.status.read() == BountyStatus::Open, 'Bounty is not open for applications');
            
            // Get application
            let mut application = self.applications.read(application_id);
            assert(!application.accepted, 'Application already accepted');
            
            // Accept application
            application.accepted = true;
            self.applications.write(application_id, application);
            
            // Update bounty status and assigned hunter
            self.status.write(BountyStatus::InProgress);
            self.assigned_hunter.write(application.applicant);
            
            // Emit event
            self.emit(Event::ApplicationAccepted(ApplicationAccepted {
                applicant: application.applicant,
                timestamp: self.get_block_timestamp(),
            }));
        }
        
        // Submit work for the bounty
        fn submit_work(ref self: ContractState, content: felt252) {
            assert(self.sender_address() == self.assigned_hunter.read(), 'Only assigned hunter can submit work');
            assert(self.status.read() == BountyStatus::InProgress, 'Bounty is not in progress');
            
            // Check if deadline has passed
            assert(self.get_block_timestamp() < self.deadline.read(), 'Bounty deadline has passed');
            
            // Create submission
            let submission_id = self.submission_count.read() + 1;
            self.submission_count.write(submission_id);
            
            let submission = Submission {
                hunter: self.sender_address(),
                content: content,
                timestamp: self.get_block_timestamp(),
                approved: false,
            };
            
            self.submissions.write(submission_id, submission);
            
            // Emit event
            self.emit(Event::SubmissionSubmitted(SubmissionSubmitted {
                hunter: self.sender_address(),
                content: content,
                timestamp: self.get_block_timestamp(),
            }));
        }
        
        // Approve submission
        fn approve_submission(ref self: ContractState, submission_id: u64) {
            assert(self.sender_address() == self.creator.read(), 'Only creator can approve submissions');
            assert(self.status.read() == BountyStatus::InProgress, 'Bounty is not in progress');
            
            // Get submission
            let mut submission = self.submissions.read(submission_id);
            assert(!submission.approved, 'Submission already approved');
            
            // Approve submission
            submission.approved = true;
            self.submissions.write(submission_id, submission);
            
            // Update bounty status
            self.status.write(BountyStatus::Completed);
            
            // Process payment
            self.process_payment();
            
            // Update reputation
            self.update_reputation();
            
            // Emit event
            self.emit(Event::SubmissionApproved(SubmissionApproved {
                hunter: submission.hunter,
                timestamp: self.get_block_timestamp(),
            }));
            
            self.emit(Event::BountyCompleted(BountyCompleted {
                bounty_address: self.get_contract_address(),
                hunter: submission.hunter,
                reward_amount: self.reward_amount.read(),
            }));
        }
        
        // Cancel bounty
        fn cancel_bounty(ref self: ContractState, reason: felt252) {
            assert(self.sender_address() == self.creator.read(), 'Only creator can cancel bounty');
            assert(
                self.status.read() == BountyStatus::Open || self.status.read() == BountyStatus::InProgress,
                'Bounty cannot be cancelled'
            );
            
            self.status.write(BountyStatus::Cancelled);
            
            // Process refund
            self.process_refund();
            
            // Emit event
            self.emit(Event::BountyCancelled(BountyCancelled {
                bounty_address: self.get_contract_address(),
                reason: reason,
            }));
        }
        
        // Get bounty details
        fn get_bounty_details(self: @ContractState) -> (felt252, felt252, u256, u64, ContractAddress, BountyStatus) {
            (
                self.title.read(),
                self.description.read(),
                self.reward_amount.read(),
                self.deadline.read(),
                self.token_address.read(),
                self.status.read(),
            )
        }
        
        // Get application
        fn get_application(self: @ContractState, application_id: u64) -> Application {
            self.applications.read(application_id)
        }
        
        // Get submission
        fn get_submission(self: @ContractState, submission_id: u64) -> Submission {
            self.submissions.read(submission_id)
        }
    }
    
    // Internal functions
    fn process_payment(self: @ContractState) {
        // This would call the payment processor to distribute rewards
        // Implementation would depend on the PaymentProcessor contract
    }
    
    fn process_refund(self: @ContractState) {
        // This would call the payment processor to refund the creator
        // Implementation would depend on the PaymentProcessor contract
    }
    
    fn update_reputation(self: @ContractState) {
        // This would call the reputation system to update scores
        // Implementation would depend on the ReputationSystem contract
    }
    
    fn get_block_timestamp(self: @ContractState) -> u64 {
        // This would get the current block timestamp
        // For now, returning a placeholder value
        1234567890
    }
}

// Interface for Bounty
#[starknet::interface]
trait IBounty {
    fn submit_application(ref self: ContractState);
    
    fn accept_application(ref self: ContractState, application_id: u64);
    
    fn submit_work(ref self: ContractState, content: felt252);
    
    fn approve_submission(ref self: ContractState, submission_id: u64);
    
    fn cancel_bounty(ref self: ContractState, reason: felt252);
    
    fn get_bounty_details(self: @ContractState) -> (felt252, felt252, u256, u64, ContractAddress, super::bounty::BountyStatus);
    
    fn get_application(self: @ContractState, application_id: u64) -> super::bounty::Application;
    
    fn get_submission(self: @ContractState, submission_id: u64) -> super::bounty::Submission;
}