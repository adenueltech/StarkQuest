// SPDX-License-Identifier: MIT
#[starknet::contract]
mod Bounty {
    use starknet::get_caller_address;
    use starknet::ContractAddress;

    // Reentrancy guard flags
    const NOT_ENTERED: felt252 = 0;
    const ENTERED: felt252 = 1;

    // Bounty status codes
    const STATUS_OPEN: felt252     = 0;
    const STATUS_CLAIMED: felt252  = 1;
    const STATUS_APPROVED: felt252 = 2;
    const STATUS_REJECTED: felt252 = 3;
    const STATUS_CLOSED: felt252   = 4;

    #[storage]
    struct Storage {
        admin: ContractAddress,
        next_id: u128,
        creators: LegacyMap<u128, ContractAddress>,
        amounts: LegacyMap<u128, u128>,
        claimants: LegacyMap<u128, ContractAddress>,
        statuses: LegacyMap<u128, felt252>,
        lock: felt252,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        BountyCreated: BountyCreated,
        BountyClaimed: BountyClaimed,
        BountyApproved: BountyApproved,
        BountyRejected: BountyRejected,
        AdminWithdrawn: AdminWithdrawn,
    }

    #[derive(Drop, starknet::Event)]
    struct BountyCreated { #[key] id: u128, creator: ContractAddress, amount: u128 }
    #[derive(Drop, starknet::Event)]
    struct BountyClaimed { #[key] id: u128, claimant: ContractAddress }
    #[derive(Drop, starknet::Event)]
    struct BountyApproved { #[key] id: u128, claimant: ContractAddress, amount: u128 }
    #[derive(Drop, starknet::Event)]
    struct BountyRejected { #[key] id: u128 }
    #[derive(Drop, starknet::Event)]
    struct AdminWithdrawn { #[key] id: u128, amount: u128 }

    #[constructor]
    fn constructor(ref self: ContractState) {
        let admin = get_caller_address();
        self.admin.write(admin);
        self.next_id.write(0);
        self.lock.write(NOT_ENTERED);
    }

    #[inline(always)]
    fn _enter(ref self: ContractState) {
        assert(self.lock.read() == NOT_ENTERED, 'REENTRANCY');
        self.lock.write(ENTERED);
    }

    #[inline(always)]
    fn _exit(ref self: ContractState) {
        self.lock.write(NOT_ENTERED);
    }

    #[external]
    fn create_bounty(ref self: ContractState, amount: u128) -> u128 {
        self._enter();
        assert(amount > 0, 'AMOUNT_MUST_BE_POSITIVE');
        let id = self.next_id.read();
        let creator = get_caller_address();
        self.creators.write(id, creator);
        self.amounts.write(id, amount);
        self.statuses.write(id, STATUS_OPEN);
        self.next_id.write(id + 1);
        emit Event::BountyCreated(BountyCreated { id, creator, amount });
        self._exit();
        id
    }

    #[external]
    fn claim_bounty(ref self: ContractState, id: u128) {
        self._enter();
        assert(self.statuses.read(id) == STATUS_OPEN, 'NOT_OPEN');
        let claimant = get_caller_address();
        self.claimants.write(id, claimant);
        self.statuses.write(id, STATUS_CLAIMED);
        emit Event::BountyClaimed(BountyClaimed { id, claimant });
        self._exit();
    }

    #[external]
    fn approve_bounty(ref self: ContractState, id: u128) {
        self._enter();
        let caller = get_caller_address();
        assert(caller == self.creators.read(id), 'ONLY_CREATOR');
        assert(self.statuses.read(id) == STATUS_CLAIMED, 'NOT_CLAIMED');
        let claimant = self.claimants.read(id);
        let amount = self.amounts.read(id);
        self.statuses.write(id, STATUS_APPROVED);
        emit Event::BountyApproved(BountyApproved { id, claimant, amount });
        self._exit();
    }

    #[external]
    fn reject_claim(ref self: ContractState, id: u128) {
        self._enter();
        let caller = get_caller_address();
        assert(caller == self.creators.read(id), 'ONLY_CREATOR');
        assert(self.statuses.read(id) == STATUS_CLAIMED, 'NOT_CLAIMED');
        self.statuses.write(id, STATUS_REJECTED);
        emit Event::BountyRejected(BountyRejected { id });
        self._exit();
    }

    #[external]
    fn admin_withdraw(ref self: ContractState, id: u128) {
        self._enter();
        let caller = get_caller_address();
        assert(caller == self.admin.read(), 'ONLY_ADMIN');
        let status = self.statuses.read(id);
        assert(status == STATUS_OPEN || status == STATUS_REJECTED, 'CANNOT_WITHDRAW');
        let amount = self.amounts.read(id);
        self.statuses.write(id, STATUS_CLOSED);
        emit Event::AdminWithdrawn(AdminWithdrawn { id, amount });
        self._exit();
    }

    #[view]
    fn get_bounty(self: @ContractState, id: u128) -> (ContractAddress, u128, felt252, ContractAddress) {
        ( self.creators.read(id), self.amounts.read(id), self.statuses.read(id), self.claimants.read(id) )
    }

    #[view]
    fn get_admin(self: @ContractState) -> ContractAddress {
        self.admin.read()
    }
}

