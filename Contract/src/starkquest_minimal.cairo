// SPDX-License-Identifier: MIT
// StarkQuest - Minimal Smart Contract
// This is a minimal version of the StarkQuest smart contract system

#[starknet::contract]
mod starkquest_minimal {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess, StorageMapWriteAccess};
    
    #[storage]
    struct Storage {
        // Simple counter
        counter: u64,
        // Simple mapping
        values: starknet::storage::Map::<u64, felt252>,
    }
    
    #[event]
    #[derive(starknet::Event, Drop)]
    enum Event {
        CounterIncreased: CounterIncreased,
        ValueStored: ValueStored,
    }
    
    #[derive(starknet::Event, Drop)]
    struct CounterIncreased {
        counter: u64,
    }
    
    #[derive(starknet::Event, Drop)]
    struct ValueStored {
        key: u64,
        value: felt252,
    }
    
    #[constructor]
    fn constructor(ref self: ContractState) {
        self.counter.write(0);
    }
    
    #[abi(embed_v0)]
    impl IStarkQuestMinimal of super::IStarkQuestMinimal<ContractState> {
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
    }
}

// Interface for StarkQuest Minimal
#[starknet::interface]
trait IStarkQuestMinimal<TContractState> {
    fn increase_counter(ref self: TContractState);
    fn get_counter(self: @TContractState) -> u64;
    fn store_value(ref self: TContractState, key: u64, value: felt252);
    fn get_value(self: @TContractState, key: u64) -> felt252;
}