# StarkEarn Smart Contract Integration Guide

This document provides guidance for smart contract developers working on the StarkEarn platform. It outlines how the frontend integrates with the smart contracts and what is expected from the contract implementations.

## Table of Contents

1. [Overview](#overview)
2. [Contract Architecture](#contract-architecture)
3. [Frontend Integration Points](#frontend-integration-points)
4. [ABI Requirements](#abi-requirements)
5. [Event Emission](#event-emission)
6. [Error Handling](#error-handling)
7. [Deployment Considerations](#deployment-considerations)
8. [Testing](#testing)

## Overview

The StarkEarn frontend is designed to work with a set of smart contracts deployed on StarkNet. The frontend uses starknet.js to interact with these contracts, and expects specific functions, events, and data structures to be available.

## Contract Architecture

The StarkEarn smart contract system consists of several interconnected contracts:

### 1. BountyRegistry

The central registry that keeps track of all bounties in the system.

**Key Responsibilities:**

- Maintains a list of all bounty addresses
- Provides search and filtering capabilities
- Tracks global statistics

### 2. BountyFactory

Factory contract responsible for creating new bounty instances using the clone pattern for gas efficiency.

**Key Responsibilities:**

- Creates new bounty contracts
- Sets initial parameters
- Registers new bounties in the BountyRegistry

### 3. Bounty (Individual Contract)

Each bounty has its own contract instance with the following functionality.

**Key Responsibilities:**

- Bounty details management
- Application handling
- Submission and review process
- Payment distribution

### 4. PaymentProcessor

Handles all payment-related operations including escrow and distribution.

**Key Responsibilities:**

- Token escrow management
- Payment distribution to bounty hunters
- Refunds to creators
- Platform fee collection

### 5. ReputationSystem

Manages reputation scores for both creators and hunters.

**Key Responsibilities:**

- Tracking user reputation
- Updating scores based on bounty completion
- Providing reputation-based access controls

## Frontend Integration Points

### Wallet Connection

The frontend connects to StarkNet wallets (ArgentX, Braavos) using the injected provider pattern:

```javascript
// Connect to wallet
const starknet = (window as any).starknet;
if (starknet) {
  await starknet.enable({ showModal: true });
  const account = starknet.account;
}
```

### Contract Interaction

The frontend uses starknet.js to interact with contracts:

```javascript
import { Contract, Account, RpcProvider } from "starknet";
import bountyFactoryAbi from "../abis/BountyFactory.json";

// Initialize provider
const provider = new RpcProvider({
  nodeUrl: "https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID",
});

// Initialize contract
const bountyFactory = new Contract(
  bountyFactoryAbi,
  bountyFactoryAddress,
  provider
);

// Call contract function
const { transaction_hash } = await account.execute({
  contractAddress: bountyFactoryAddress,
  entrypoint: "create_bounty",
  calldata: [title, description, category, rewardToken, rewardAmount, deadline],
});
```

## ABI Requirements

The frontend expects the following ABI structures for each contract:

### BountyRegistry ABI

```json
[
  {
    "name": "get_bounty_count",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "count",
        "type": "core::integer::u256"
      }
    ],
    "state_mutability": "view"
  },
  {
    "name": "get_bounty_address",
    "type": "function",
    "inputs": [
      {
        "name": "index",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [
      {
        "name": "bounty_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "state_mutability": "view"
  }
]
```

### BountyFactory ABI

```json
[
  {
    "name": "create_bounty",
    "type": "function",
    "inputs": [
      {
        "name": "title",
        "type": "core::felt252"
      },
      {
        "name": "description",
        "type": "core::felt252"
      },
      {
        "name": "category",
        "type": "core::felt252"
      },
      {
        "name": "reward_token",
        "type": "core::felt252"
      },
      {
        "name": "reward_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "deadline",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [
      {
        "name": "bounty_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "state_mutability": "external"
  }
]
```

### Bounty ABI

```json
[
  {
    "name": "submit_application",
    "type": "function",
    "inputs": [
      {
        "name": "proposal",
        "type": "core::felt252"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "name": "review_application",
    "type": "function",
    "inputs": [
      {
        "name": "application_index",
        "type": "core::integer::u256"
      },
      {
        "name": "status",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "name": "complete_bounty",
    "type": "function",
    "inputs": [
      {
        "name": "submission",
        "type": "core::felt252"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  }
]
```

### PaymentProcessor ABI

```json
[
  {
    "name": "distribute_payment",
    "type": "function",
    "inputs": [
      {
        "name": "hunter",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  }
]
```

### ReputationSystem ABI

```json
[
  {
    "name": "get_user_reputation",
    "type": "function",
    "inputs": [
      {
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [
      {
        "name": "reputation",
        "type": "core::integer::u256"
      }
    ],
    "state_mutability": "view"
  }
]
```

## Event Emission

The frontend listens for specific events to update the UI and trigger notifications. Contracts should emit the following events:

### BountyCreated

Emitted when a new bounty is created.

```cairo
event BountyCreated {
    bounty_address: felt,
    creator: felt,
    reward_amount: uint256,
    deadline: uint256
}
```

### ApplicationSubmitted

Emitted when a hunter submits an application.

```cairo
event ApplicationSubmitted {
    bounty_address: felt,
    hunter: felt,
    application_index: felt
}
```

### ApplicationReviewed

Emitted when a creator reviews an application.

```cairo
event ApplicationReviewed {
    bounty_address: felt,
    hunter: felt,
    status: ApplicationStatus
}
```

### BountyCompleted

Emitted when a bounty is marked as completed.

```cairo
event BountyCompleted {
    bounty_address: felt,
    hunter: felt,
    submission: felt
}
```

### PaymentDistributed

Emitted when payment is distributed to a hunter.

```cairo
event PaymentDistributed {
    bounty_address: felt,
    hunter: felt,
    amount: uint256
}
```

## Error Handling

Contracts should implement clear error messages for common failure scenarios:

1. **Insufficient Funds**: When a creator doesn't have enough tokens for escrow
2. **Unauthorized Access**: When a user tries to perform an action they're not authorized for
3. **Invalid Parameters**: When function parameters are invalid
4. **Deadline Passed**: When trying to perform actions after the bounty deadline
5. **Already Completed**: When trying to complete an already completed bounty

Example error implementation in Cairo:

```cairo
// Check if deadline has passed
if (get_block_timestamp() > deadline) {
    panic_with_felt252('Deadline has passed');
}
```

## Deployment Considerations

### Contract Addresses

The frontend expects contract addresses to be configured in `lib/config.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  BOUNTY_REGISTRY: "0x...",
  BOUNTY_FACTORY: "0x...",
  PAYMENT_PROCESSOR: "0x...",
  REPUTATION_SYSTEM: "0x...",
};
```

### Network Configuration

The frontend supports both Goerli testnet and mainnet:

```typescript
export const NETWORK = "goerli"; // or "mainnet" for production
```

### Token Addresses

Common token addresses should be configured:

```typescript
export const TOKEN_ADDRESSES = {
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
};
```

## Testing

### Unit Tests

All contracts should have comprehensive unit tests covering:

- Happy path scenarios
- Edge cases
- Error conditions
- Security vulnerabilities

### Integration Tests

Test the interaction between different contracts:

- Bounty creation and registration
- Application submission and review
- Payment processing
- Reputation updates

### Test Coverage

Aim for at least 90% test coverage for all critical functions.

### Testing Tools

Recommended testing tools:

- starknet-devnet for local testing
- pytest for Python-based tests
- cairo-test for Cairo-specific tests

## Frontend Development Notes

For frontend developers working with these contracts:

### Data Types

- Use `cairo.felt` for string conversion
- Use `cairo.uint256` for large numbers
- Use `CallData.compile()` for calldata preparation

### Error Handling

Frontend error handling expects:

- Clear error messages from contracts
- Proper transaction rejection handling
- User-friendly error display

### Loading States

Implement loading states for:

- Wallet connection
- Transaction submission
- Transaction confirmation
- Data fetching

## Security Considerations

### Reentrancy Protection

All external calls that transfer funds should be protected against reentrancy attacks.

### Access Control

Ensure only authorized parties can perform sensitive operations:

- Only creators can review applications
- Only selected hunters can complete bounties
- Only contract owners can update platform parameters

### Deadline Validation

Always check that deadlines haven't passed before allowing certain operations.

### Payment Validation

Validate all payment amounts and ensure escrow balances are sufficient.

### Integer Overflow

Use safe math operations for all numeric calculations.

## Future Enhancements

### Multi-signature Escrow

Implement multi-sig for large bounty payments.

### Dispute Resolution

Add arbitration mechanisms for contested bounties.

### Token Staking

Allow users to stake tokens for reputation boosting.

### Cross-chain Compatibility

Enable bounties payable in multiple token standards.

### DAO Governance

Implement community governance for platform parameters.

## Support and Contact

For questions about the smart contract integration or to report issues:

- GitHub: https://github.com/StarkEarn/contracts
- Discord: https://discord.gg/StarkEarn
- Email: contracts@StarkEarn.io
