// StarkEarn - Main Contract
// Main entry point for the StarkEarn smart contract system

#[starknet::contract]
mod stark_earn {
    use starknet::ContractAddress;
    use starknet::ClassHash;
    use starknet::SyscallResultTrait;
    use starknet::get_contract_address;
    use starknet::storage::{StoragePointerRead, StoragePointerWrite};
    
    #[storage]
    struct Storage {
        // Addresses of core contracts
        bounty_registry: ContractAddress,
        bounty_factory: ContractAddress,
        payment_processor: ContractAddress,
        reputation_system: ContractAddress,
        
        // Class hashes for cloning
        bounty_class_hash: ClassHash,
        
        // Owner of the system
        owner: ContractAddress,
        
        // System status
        is_initialized: bool,
    }
    
    #[event]
    #[derive(starknet::Event)]
    enum Event {
        SystemInitialized: SystemInitialized,
        ContractsUpdated: ContractsUpdated,
    }
    
    #[derive(starknet::Event)]
    struct SystemInitialized {
        owner: ContractAddress,
        timestamp: u64,
    }
    
    #[derive(starknet::Event)]
    struct ContractsUpdated {
        updater: ContractAddress,
        timestamp: u64,
    }
    
    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
        self.is_initialized.write(false);
    }
    
    #[external(v0)]
    impl IStarkEarn of super::IStarkEarn {
        // Initialize the StarkEarn system with core contracts
        fn initialize(
            ref self: ContractState,
            bounty_registry: ContractAddress,
            bounty_factory: ContractAddress,
            payment_processor: ContractAddress,
            reputation_system: ContractAddress,
            bounty_class_hash: ClassHash
        ) {
            assert(self.sender_address() == self.owner.read(), 'Only owner can initialize');
            assert(!self.is_initialized.read(), 'System already initialized');
            
            self.bounty_registry.write(bounty_registry);
            self.bounty_factory.write(bounty_factory);
            self.payment_processor.write(payment_processor);
            self.reputation_system.write(reputation_system);
            self.bounty_class_hash.write(bounty_class_hash);
            self.is_initialized.write(true);
            
            // Emit event
            self.emit(Event::SystemInitialized(SystemInitialized {
                owner: self.owner.read(),
                timestamp: self.get_block_timestamp(),
            }));
        }
        
        // Create a new bounty
        fn create_bounty(
            ref self: ContractState,
            title: felt252,
            description: felt252,
            reward_amount: u256,
            deadline: u64,
            token_address: ContractAddress
        ) -> ContractAddress {
            assert(self.is_initialized.read(), 'System not initialized');
            
            // Check if user can create bounties based on reputation
            self.check_reputation_for_creation(self.sender_address());
            
            // Call factory to create bounty
            let factory = self.bounty_factory.read();
            // This would be a library call to the factory's create_bounty function
            // For now, we'll return a placeholder address
            get_contract_address()
        }
        
        // Get core contract addresses
        fn get_contract_addresses(
            self: @ContractState
        ) -> (ContractAddress, ContractAddress, ContractAddress, ContractAddress) {
            (
                self.bounty_registry.read(),
                self.bounty_factory.read(),
                self.payment_processor.read(),
                self.reputation_system.read(),
            )
        }
        
        // Update contract addresses (owner only)
        fn update_contract_addresses(
            ref self: ContractState,
            bounty_registry: ContractAddress,
            bounty_factory: ContractAddress,
            payment_processor: ContractAddress,
            reputation_system: ContractAddress
        ) {
            assert(self.sender_address() == self.owner.read(), 'Only owner can update contracts');
            
            self.bounty_registry.write(bounty_registry);
            self.bounty_factory.write(bounty_factory);
            self.payment_processor.write(payment_processor);
            self.reputation_system.write(reputation_system);
            
            // Emit event
            self.emit(Event::ContractsUpdated(ContractsUpdated {
                updater: self.sender_address(),
                timestamp: self.get_block_timestamp(),
            }));
        }
        
        // Get system status
        fn is_system_initialized(self: @ContractState) -> bool {
            self.is_initialized.read()
        }
    }
    
    // Internal functions
    fn check_reputation_for_creation(self: @ContractState, user: ContractAddress) {
        // This would call the reputation system to check if user can create bounties
        // Implementation would depend on the ReputationSystem contract
    }
    
    fn get_block_timestamp(self: @ContractState) -> u64 {
        // This would get the current block timestamp
        // For now, returning a placeholder value
        1234567890
    }
}

// Interface for StarkEarn
#[starknet::interface]
trait IStarkEarn {
    fn initialize(
        ref self: ContractState,
        bounty_registry: ContractAddress,
        bounty_factory: ContractAddress,
        payment_processor: ContractAddress,
        reputation_system: ContractAddress,
        bounty_class_hash: ClassHash
    );
    
    fn create_bounty(
        ref self: ContractState,
        title: felt252,
        description: felt252,
        reward_amount: u256,
        deadline: u64,
        token_address: ContractAddress
    ) -> ContractAddress;
    
    fn get_contract_addresses(
        self: @ContractState
    ) -> (ContractAddress, ContractAddress, ContractAddress, ContractAddress);
    
    fn update_contract_addresses(
        ref self: ContractState,
        bounty_registry: ContractAddress,
        bounty_factory: ContractAddress,
        payment_processor: ContractAddress,
        reputation_system: ContractAddress
    );
    
    fn is_system_initialized(self: @ContractState) -> bool;
}