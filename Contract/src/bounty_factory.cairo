// StarkEarn - BountyFactory Contract
// Factory contract for creating new bounties using the clone pattern

#[starknet::contract]
mod bounty_factory {
    use starknet::ContractAddress;
    use starknet::ClassHash;
    use starknet::SyscallResultTrait;
    use starknet::get_contract_address;
    use starknet::storage::{StoragePointerRead, StoragePointerWrite};
    use starknet::library_call_syscall;
    use starknet::deploy_syscall;
    
    #[storage]
    struct Storage {
        // Address of the BountyRegistry
        registry_address: ContractAddress,
        // Class hash of the Bounty contract for cloning
        bounty_class_hash: ClassHash,
        // Owner of the factory
        owner: ContractAddress,
    }
    
    #[event]
    #[derive(starknet::Event)]
    enum Event {
        BountyCreated: BountyCreated,
    }
    
    #[derive(starknet::Event)]
    struct BountyCreated {
        bounty_address: ContractAddress,
        creator: ContractAddress,
        bounty_id: u64,
    }
    
    #[constructor]
    fn constructor(
        ref self: ContractState,
        registry_address: ContractAddress,
        bounty_class_hash: ClassHash,
        owner: ContractAddress
    ) {
        self.registry_address.write(registry_address);
        self.bounty_class_hash.write(bounty_class_hash);
        self.owner.write(owner);
    }
    
    #[external(v0)]
    impl IBountyFactory of super::IBountyFactory {
        // Create a new bounty contract
        fn create_bounty(
            ref self: ContractState,
            title: felt252,
            description: felt252,
            reward_amount: u256,
            deadline: u64,
            token_address: ContractAddress
        ) -> ContractAddress {
            // Deploy a new bounty contract using the class hash
            let bounty_address = self.deploy_bounty_contract(
                title,
                description,
                reward_amount,
                deadline,
                token_address
            );
            
            // Register the bounty with the registry
            let registry = self.registry_address.read();
            let bounty_id = self.register_bounty_with_registry(
                registry,
                bounty_address,
                self.sender_address()
            );
            
            // Emit event
            self.emit(Event::BountyCreated(BountyCreated {
                bounty_address,
                creator: self.sender_address(),
                bounty_id,
            }));
            
            bounty_address
        }
        
        // Set the registry address
        fn set_registry_address(ref self: ContractState, registry_address: ContractAddress) {
            assert(self.sender_address() == self.owner.read(), 'Only owner can set registry address');
            self.registry_address.write(registry_address);
        }
        
        // Set the bounty class hash
        fn set_bounty_class_hash(ref self: ContractState, class_hash: ClassHash) {
            assert(self.sender_address() == self.owner.read(), 'Only owner can set class hash');
            self.bounty_class_hash.write(class_hash);
        }
    }
    
    // Internal functions
    fn deploy_bounty_contract(
        self: @ContractState,
        title: felt252,
        description: felt252,
        reward_amount: u256,
        deadline: u64,
        token_address: ContractAddress
    ) -> ContractAddress {
        // Deploy a new instance of the bounty contract
        // This would use the deploy_syscall with the class hash
        // For now, we'll return a placeholder address
        get_contract_address()
    }
    
    fn register_bounty_with_registry(
        self: @ContractState,
        registry_address: ContractAddress,
        bounty_address: ContractAddress,
        creator: ContractAddress
    ) -> u64 {
        // This would call the registry to register the new bounty
        // For now, we'll return a placeholder ID
        1
    }
}

// Interface for BountyFactory
#[starknet::interface]
trait IBountyFactory {
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