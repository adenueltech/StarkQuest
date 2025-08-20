// StarkEarn - BountyRegistry Contract
// Main registry for all bounties in the system

#[starknet::contract]
mod bounty_registry {
    use starknet::ContractAddress;
    use starknet::SyscallResultTrait;
    use starknet::get_contract_address;
    use starknet::storage::{StoragePointerRead, StoragePointerWrite};
    
    #[storage]
    struct Storage {
        // List of all bounty addresses
        bounty_addresses: LegacyMap::<u64, ContractAddress>,
        // Counter for bounty IDs
        bounty_count: u64,
        // Owner of the registry
        owner: ContractAddress,
        // Global statistics
        total_bounties_created: u64,
        total_bounties_completed: u64,
    }
    
    #[event]
    #[derive(starknet::Event)]
    enum Event {
        BountyRegistered: BountyRegistered,
    }
    
    #[derive(starknet::Event)]
    struct BountyRegistered {
        bounty_id: u64,
        bounty_address: ContractAddress,
        creator: ContractAddress,
    }
    
    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
        self.bounty_count.write(0);
        self.total_bounties_created.write(0);
        self.total_bounties_completed.write(0);
    }
    
    #[external(v0)]
    impl IBountyRegistry of super::IBountyRegistry {
        // Register a new bounty in the registry
        fn register_bounty(
            ref self: ContractState,
            bounty_address: ContractAddress,
            creator: ContractAddress
        ) -> u64 {
            // Only factory can register bounties
            assert!(self.sender_is_factory(), 'Only factory can register bounties');
            
            // Increment bounty count
            let bounty_id = self.bounty_count.read() + 1;
            self.bounty_count.write(bounty_id);
            
            // Store bounty address
            self.bounty_addresses.write(bounty_id, bounty_address);
            
            // Update global statistics
            let total_created = self.total_bounties_created.read() + 1;
            self.total_bounties_created.write(total_created);
            
            // Emit event
            self.emit(Event::BountyRegistered(BountyRegistered {
                bounty_id,
                bounty_address,
                creator,
            }));
            
            bounty_id
        }
        
        // Get bounty address by ID
        fn get_bounty_address(self: @ContractState, bounty_id: u64) -> ContractAddress {
            self.bounty_addresses.read(bounty_id)
        }
        
        // Get total number of bounties
        fn get_bounty_count(self: @ContractState) -> u64 {
            self.bounty_count.read()
        }
        
        // Get global statistics
        fn get_global_stats(self: @ContractState) -> (u64, u64) {
            (self.total_bounties_created.read(), self.total_bounties_completed.read())
        }
        
        // Update completed bounties count
        fn update_completed_bounties(ref self: ContractState) {
            let completed = self.total_bounties_completed.read() + 1;
            self.total_bounties_completed.write(completed);
        }
    }
    
    // Internal functions
    fn sender_is_factory(self: @ContractState) -> bool {
        // This would check if sender is the factory contract
        // For now, we'll implement a simple check
        self.sender_address() == self.owner.read()
    }
}

// Interface for BountyRegistry
#[starknet::interface]
trait IBountyRegistry {
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