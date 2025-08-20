// StarkEarn - ReputationSystem Contract
// Manages reputation scores for both creators and hunters

#[starknet::contract]
mod reputation_system {
    use starknet::ContractAddress;
    use starknet::SyscallResultTrait;
    use starknet::get_contract_address;
    use starknet::storage::{StoragePointerRead, StoragePointerWrite};
    
    // Reputation record structure
    #[derive(Drop, Copy)]
    struct ReputationRecord {
        score: u64,
        bounty_count: u64,
        completed_count: u64,
    }
    
    #[storage]
    struct Storage {
        // Owner of the reputation system
        owner: ContractAddress,
        // Reputation records for users
        user_reputations: LegacyMap::<ContractAddress, ReputationRecord>,
        // Minimum reputation required for certain actions
        min_reputation_for_creation: u64,
        min_reputation_for_application: u64,
        // Total users with reputation
        total_users: u64,
    }
    
    #[event]
    #[derive(starknet::Event)]
    enum Event {
        ReputationUpdated: ReputationUpdated,
        UserRegistered: UserRegistered,
    }
    
    #[derive(starknet::Event)]
    struct ReputationUpdated {
        user: ContractAddress,
        old_score: u64,
        new_score: u64,
        reason: felt252,
    }
    
    #[derive(starknet::Event)]
    struct UserRegistered {
        user: ContractAddress,
        initial_score: u64,
    }
    
    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        min_reputation_for_creation: u64,
        min_reputation_for_application: u64
    ) {
        self.owner.write(owner);
        self.min_reputation_for_creation.write(min_reputation_for_creation);
        self.min_reputation_for_application.write(min_reputation_for_application);
        self.total_users.write(0);
    }
    
    #[external(v0)]
    impl IReputationSystem of super::IReputationSystem {
        // Register a new user with initial reputation
        fn register_user(ref self: ContractState, user: ContractAddress, initial_score: u64) {
            // Only owner or authorized contracts can register users
            assert(self.sender_is_authorized(), 'Unauthorized caller');
            
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
            
            // Update total users
            let total = self.total_users.read() + 1;
            self.total_users.write(total);
            
            // Emit event
            self.emit(Event::UserRegistered(UserRegistered {
                user: user,
                initial_score: initial_score,
            }));
        }
        
        // Update user reputation based on bounty completion
        fn update_reputation(
            ref self: ContractState,
            user: ContractAddress,
            is_creator: bool,
            is_completed: bool,
            quality_score: u64  // 1-100 quality rating
        ) {
            // Only authorized contracts can update reputation
            assert(self.sender_is_authorized(), 'Unauthorized caller');
            
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
            let reputation_change = self.calculate_reputation_change(
                is_creator,
                is_completed,
                quality_score
            );
            
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
        
        // Get user reputation
        fn get_user_reputation(self: @ContractState, user: ContractAddress) -> ReputationRecord {
            self.user_reputations.read(user)
        }
        
        // Check if user can create bounties
        fn can_create_bounties(self: @ContractState, user: ContractAddress) -> bool {
            let record = self.user_reputations.read(user);
            record.score >= self.min_reputation_for_creation.read()
        }
        
        // Check if user can apply for bounties
        fn can_apply_for_bounties(self: @ContractState, user: ContractAddress) -> bool {
            let record = self.user_reputations.read(user);
            record.score >= self.min_reputation_for_application.read()
        }
        
        // Get total number of users with reputation
        fn get_total_users(self: @ContractState) -> u64 {
            self.total_users.read()
        }
        
        // Set minimum reputation requirements
        fn set_min_reputation_requirements(
            ref self: ContractState,
            for_creation: u64,
            for_application: u64
        ) {
            assert(self.sender_address() == self.owner.read(), 'Only owner can set requirements');
            self.min_reputation_for_creation.write(for_creation);
            self.min_reputation_for_application.write(for_application);
        }
    }
    
    // Internal functions
    fn sender_is_authorized(self: @ContractState) -> bool {
        // This would check if the sender is an authorized contract (bounty factory, registry, etc.)
        // For now, we'll implement a simple check
        self.sender_address() == self.owner.read()
    }
    
    fn calculate_reputation_change(
        self: @ContractState,
        is_creator: bool,
        is_completed: bool,
        quality_score: u64
    ) -> u64 {
        // Simple reputation calculation logic
        // In a real implementation, this would be more complex
        if is_completed {
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
        }
    }
}

// Interface for ReputationSystem
#[starknet::interface]
trait IReputationSystem {
    fn register_user(ref self: ContractState, user: ContractAddress, initial_score: u64);
    
    fn update_reputation(
        ref self: ContractState,
        user: ContractAddress,
        is_creator: bool,
        is_completed: bool,
        quality_score: u64
    );
    
    fn get_user_reputation(self: @ContractState, user: ContractAddress) -> super::reputation_system::ReputationRecord;
    
    fn can_create_bounties(self: @ContractState, user: ContractAddress) -> bool;
    
    fn can_apply_for_bounties(self: @ContractState, user: ContractAddress) -> bool;
    
    fn get_total_users(self: @ContractState) -> u64;
    
    fn set_min_reputation_requirements(
        ref self: ContractState,
        for_creation: u64,
        for_application: u64
    );
}