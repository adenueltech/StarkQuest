// StarkEarn - PaymentProcessor Contract
// Handles all payment-related operations including escrow and distribution

#[starknet::contract]
mod payment_processor {
    use starknet::ContractAddress;
    use starknet::SyscallResultTrait;
    use starknet::get_contract_address;
    use starknet::storage::{StoragePointerRead, StoragePointerWrite};
    use starknet::library_call_syscall;
    
    #[storage]
    struct Storage {
        // Owner of the payment processor
        owner: ContractAddress,
        // Platform fee percentage (in basis points, e.g., 100 = 1%)
        platform_fee_basis_points: u64,
        // Total platform fees collected
        total_platform_fees: u256,
        // Escrow balances for bounties
        escrow_balances: LegacyMap::<ContractAddress, u256>,
        // Token balances
        token_balances: LegacyMap::<ContractAddress, LegacyMap::<ContractAddress, u256>>,
    }
    
    #[event]
    #[derive(starknet::Event)]
    enum Event {
        PaymentProcessed: PaymentProcessed,
        RefundProcessed: RefundProcessed,
        PlatformFeeCollected: PlatformFeeCollected,
        EscrowDeposited: EscrowDeposited,
        EscrowReleased: EscrowReleased,
    }
    
    #[derive(starknet::Event)]
    struct PaymentProcessed {
        bounty_address: ContractAddress,
        hunter: ContractAddress,
        amount: u256,
        platform_fee: u256,
    }
    
    #[derive(starknet::Event)]
    struct RefundProcessed {
        bounty_address: ContractAddress,
        creator: ContractAddress,
        amount: u256,
    }
    
    #[derive(starknet::Event)]
    struct PlatformFeeCollected {
        amount: u256,
    }
    
    #[derive(starknet::Event)]
    struct EscrowDeposited {
        bounty_address: ContractAddress,
        amount: u256,
    }
    
    #[derive(starknet::Event)]
    struct EscrowReleased {
        bounty_address: ContractAddress,
        amount: u256,
    }
    
    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress, platform_fee_basis_points: u64) {
        self.owner.write(owner);
        self.platform_fee_basis_points.write(platform_fee_basis_points);
        self.total_platform_fees.write(0);
    }
    
    #[external(v0)]
    impl IPaymentProcessor of super::IPaymentProcessor {
        // Deposit funds into escrow for a bounty
        fn deposit_escrow(ref self: ContractState, bounty_address: ContractAddress, amount: u256) {
            // Update escrow balance
            let current_balance = self.escrow_balances.read(bounty_address);
            let new_balance = current_balance + amount;
            self.escrow_balances.write(bounty_address, new_balance);
            
            // Emit event
            self.emit(Event::EscrowDeposited(EscrowDeposited {
                bounty_address: bounty_address,
                amount: amount,
            }));
        }
        
        // Process payment to hunter and platform fee
        fn process_payment(
            ref self: ContractState,
            bounty_address: ContractAddress,
            hunter: ContractAddress,
            amount: u256
        ) {
            // Verify sender is authorized (bounty contract)
            assert(self.sender_is_authorized(bounty_address), 'Unauthorized caller');
            
            // Calculate platform fee
            let platform_fee = self.calculate_platform_fee(amount);
            let hunter_amount = amount - platform_fee;
            
            // Update escrow balance
            let current_balance = self.escrow_balances.read(bounty_address);
            assert(current_balance >= amount, 'Insufficient escrow balance');
            let new_balance = current_balance - amount;
            self.escrow_balances.write(bounty_address, new_balance);
            
            // Update platform fees collected
            let total_fees = self.total_platform_fees.read() + platform_fee;
            self.total_platform_fees.write(total_fees);
            
            // Transfer funds to hunter (simplified - would need actual token transfer logic)
            self.transfer_tokens(bounty_address, hunter, hunter_amount);
            
            // Emit events
            self.emit(Event::PaymentProcessed(PaymentProcessed {
                bounty_address: bounty_address,
                hunter: hunter,
                amount: hunter_amount,
                platform_fee: platform_fee,
            }));
            
            self.emit(Event::PlatformFeeCollected(PlatformFeeCollected {
                amount: platform_fee,
            }));
        }
        
        // Process refund to creator
        fn process_refund(ref self: ContractState, bounty_address: ContractAddress, creator: ContractAddress, amount: u256) {
            // Verify sender is authorized (bounty contract)
            assert(self.sender_is_authorized(bounty_address), 'Unauthorized caller');
            
            // Update escrow balance
            let current_balance = self.escrow_balances.read(bounty_address);
            assert(current_balance >= amount, 'Insufficient escrow balance');
            let new_balance = current_balance - amount;
            self.escrow_balances.write(bounty_address, new_balance);
            
            // Transfer funds to creator (simplified - would need actual token transfer logic)
            self.transfer_tokens(bounty_address, creator, amount);
            
            // Emit event
            self.emit(Event::RefundProcessed(RefundProcessed {
                bounty_address: bounty_address,
                creator: creator,
                amount: amount,
            }));
        }
        
        // Withdraw platform fees (owner only)
        fn withdraw_platform_fees(ref self: ContractState, amount: u256, recipient: ContractAddress) {
            assert(self.sender_address() == self.owner.read(), 'Only owner can withdraw fees');
            
            let current_fees = self.total_platform_fees.read();
            assert(current_fees >= amount, 'Insufficient platform fees');
            
            let new_fees = current_fees - amount;
            self.total_platform_fees.write(new_fees);
            
            // Transfer funds to recipient (simplified - would need actual token transfer logic)
            // Implementation would depend on the specific token being used
        }
        
        // Get escrow balance for a bounty
        fn get_escrow_balance(self: @ContractState, bounty_address: ContractAddress) -> u256 {
            self.escrow_balances.read(bounty_address)
        }
        
        // Get total platform fees collected
        fn get_total_platform_fees(self: @ContractState) -> u256 {
            self.total_platform_fees.read()
        }
        
        // Set platform fee percentage
        fn set_platform_fee_basis_points(ref self: ContractState, basis_points: u64) {
            assert(self.sender_address() == self.owner.read(), 'Only owner can set fee');
            assert(basis_points <= 10000, 'Fee cannot exceed 100%');
            self.platform_fee_basis_points.write(basis_points);
        }
    }
    
    // Internal functions
    fn calculate_platform_fee(self: @ContractState, amount: u256) -> u256 {
        let basis_points = self.platform_fee_basis_points.read();
        (amount * basis_points) / 10000
    }
    
    fn sender_is_authorized(self: @ContractState, bounty_address: ContractAddress) -> bool {
        // This would check if the sender is an authorized bounty contract
        // For now, we'll implement a simple check
        self.sender_address() == bounty_address
    }
    
    fn transfer_tokens(self: @ContractState, from: ContractAddress, to: ContractAddress, amount: u256) {
        // This would handle actual token transfers
        // Implementation would depend on the specific token standard being used (ERC20, etc.)
        // For now, this is a placeholder
    }
}

// Interface for PaymentProcessor
#[starknet::interface]
trait IPaymentProcessor {
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