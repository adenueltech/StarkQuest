%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.uint256 import Uint256

# ERC20 interface
@contract_interface
namespace IERC20 {
    func transfer(recipient: felt, amount: Uint256) -> (success: felt) {}
    func transferFrom(sender: felt, recipient: felt, amount: Uint256) -> (success: felt) {}
}

# Bounty Escrow Contract with 8 main functions

@storage_var
func owner() -> (res: felt):
end

@storage_var
func bounty_count() -> (res: felt):
end

@storage_var
func bounty_creator(bounty_id: felt) -> (res: felt):
end

@storage_var
func bounty_token(bounty_id: felt) -> (res: felt):
end

@storage_var
func bounty_reward(bounty_id: felt) -> (res: Uint256):
end

@storage_var
func bounty_open(bounty_id: felt) -> (res: felt):
end

@storage_var
func bounty_claimer(bounty_id: felt) -> (res: felt):
end

@storage_var
func bounty_claim_hash(bounty_id: felt) -> (res: felt):
end

@storage_var
func bounty_claim_status(bounty_id: felt) -> (res: felt):
end
# claim_status: 0 = no claim, 1 = submitted, 2 = approved, 3 = rejected

# Events
@event
func BountyCreated(bounty_id: felt, creator: felt, token: felt, reward_low: felt, reward_high: felt):
end

@event
func ClaimSubmitted(bounty_id: felt, claimer: felt, claim_hash: felt):
end

@event
func ClaimApproved(bounty_id: felt, claimer: felt, payout_low: felt, payout_high: felt):
end

@event
func ClaimRejected(bounty_id: felt, claimer: felt):
end

@event
func BountyCancelled(bounty_id: felt):
end

@event
func RefundIssued(bounty_id: felt, recipient: felt, amount_low: felt, amount_high: felt):
end

# Constructor
@external
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    let (caller) = get_caller_address()
    owner.write(caller)
    bounty_count.write(0)
    return ()
}

# 1. create_bounty
@external
func create_bounty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(token: felt, reward: Uint256) -> (bounty_id: felt) {
    let (cnt) = bounty_count.read()
    let new_id = cnt + 1
    bounty_count.write(new_id)

    let (creator) = get_caller_address()
    bounty_creator.write(new_id, creator)
    bounty_token.write(new_id, token)
    bounty_reward.write(new_id, reward)
    bounty_open.write(new_id, 1)
    bounty_claimer.write(new_id, 0)
    bounty_claim_status.write(new_id, 0)

    BountyCreated.emit(new_id, creator, token, reward.low, reward.high)
    return (new_id,)
}

# 2. claim_bounty
@external
func claim_bounty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(bounty_id: felt, claim_hash: felt) -> () {
    let (is_open) = bounty_open.read(bounty_id)
    assert is_open == 1

    let (status) = bounty_claim_status.read(bounty_id)
    assert status == 0

    let (claimer) = get_caller_address()
    bounty_claimer.write(bounty_id, claimer)
    bounty_claim_hash.write(bounty_id, claim_hash)
    bounty_claim_status.write(bounty_id, 1)

    ClaimSubmitted.emit(bounty_id, claimer, claim_hash)
    return ()
}

# 3. approve_claim
@external
func approve_claim{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(bounty_id: felt) -> () {
    let (caller) = get_caller_address()
    let (creator) = bounty_creator.read(bounty_id)
    assert caller == creator

    let (status) = bounty_claim_status.read(bounty_id)
    assert status == 1

    let (claimer) = bounty_claimer.read(bounty_id)
    let (reward) = bounty_reward.read(bounty_id)
    let (token) = bounty_token.read(bounty_id)

    bounty_claim_status.write(bounty_id, 2)
    bounty_open.write(bounty_id, 0)

    let erc20 = IERC20.at(token)
    let (ok) = erc20.transfer(claimer, reward)
    assert ok == 1

    ClaimApproved.emit(bounty_id, claimer, reward.low, reward.high)
    return ()
}

# 4. reject_claim
@external
func reject_claim{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(bounty_id: felt) -> () {
    let (caller) = get_caller_address()
    let (creator) = bounty_creator.read(bounty_id)
    assert caller == creator

    let (status) = bounty_claim_status.read(bounty_id)
    assert status == 1

    let (claimer) = bounty_claimer.read(bounty_id)
    bounty_claim_status.write(bounty_id, 3)

    ClaimRejected.emit(bounty_id, claimer)
    return ()
}

# 5. cancel_bounty
@external
func cancel_bounty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(bounty_id: felt) -> () {
    let (caller) = get_caller_address()
    let (creator) = bounty_creator.read(bounty_id)
    assert caller == creator

    let (is_open) = bounty_open.read(bounty_id)
    assert is_open == 1

    let (reward) = bounty_reward.read(bounty_id)
    let (token) = bounty_token.read(bounty_id)

    bounty_open.write(bounty_id, 0)

    let erc20 = IERC20.at(token)
    let (ok) = erc20.transfer(creator, reward)
    assert ok == 1

    BountyCancelled.emit(bounty_id)
    RefundIssued.emit(bounty_id, creator, reward.low, reward.high)
    return ()
}

# 6. get_bounty
@view
func get_bounty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(bounty_id: felt) -> (creator: felt, token: felt, reward: Uint256, is_open: felt, claimer: felt, status: felt) {
    let (creator) = bounty_creator.read(bounty_id)
    let (token) = bounty_token.read(bounty_id)
    let (reward) = bounty_reward.read(bounty_id)
    let (is_open) = bounty_open.read(bounty_id)
    let (claimer) = bounty_claimer.read(bounty_id)
    let (status) = bounty_claim_status.read(bounty_id)
    return (creator, token, reward, is_open, claimer, status)
}

# 7. get_all_bounty
@view
func get_all_bounty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (count: felt) {
    let (cnt) = bounty_count.read()
    return (cnt,)
}

# 8. admin_withdrawal
@external
func admin_withdrawal{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(token: felt, to: felt, amount: Uint256) -> () {
    let (caller) = get_caller_address()
    let (adm) = owner.read()
    assert caller == adm

    let erc20 = IERC20.at(token)
    let (ok) = erc20.transfer(to, amount)
    assert ok == 1
    return ()
}

# === End of contract ===
