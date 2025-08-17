# StarkEarn Smart Contracts Documentation

This document provides comprehensive guidance for smart contract developers working on the StarkEarn platform. It outlines the contract architecture, key functionalities, and integration points.

## Table of Contents

1. [Overview](#overview)
2. [Contract Architecture](#contract-architecture)
3. [Core Contracts](#core-contracts)
4. [Data Structures](#data-structures)
5. [Key Functions](#key-functions)
6. [Events](#events)
7. [Security Considerations](#security-considerations)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Integration Guide](#integration-guide)

## Overview

StarkEarn is a decentralized bounty platform built on StarkNet that connects project creators with skilled developers, designers, and other contributors. The platform uses smart contracts to handle bounty creation, application management, payment escrow, and reward distribution.

## Contract Architecture

The StarkEarn smart contract system consists of several interconnected contracts:

1. **BountyRegistry** - Main registry for all bounties
2. **BountyFactory** - Factory contract for creating new bounties
3. **Bounty** - Individual bounty contract (clone pattern)
4. **PaymentProcessor** - Handles payments and escrow
5. **ReputationSystem** - Manages user reputation scores
6. **TokenBridge** - Handles cross-chain token transfers (if applicable)

## Core Contracts

### BountyRegistry

The central registry that keeps track of all bounties in the system.

Key responsibilities:

- Maintains a list of all bounty addresses
- Provides search and filtering capabilities
- Tracks global statistics

### BountyFactory

Factory contract responsible for creating new bounty instances using the clone pattern for gas efficiency.

Key responsibilities:

- Creates new bounty contracts
- Sets initial parameters
- Registers new bounties in the BountyRegistry

### Bounty (Individual Contract)

Each bounty has its own contract instance with the following functionality:

Key responsibilities:

- Bounty details management
- Application handling
- Submission and review process
- Payment distribution

### PaymentProcessor

Handles all payment-related operations including escrow and distribution.

Key responsibilities:

- Token escrow management
- Payment distribution to bounty hunters
- Refunds to creators
- Platform fee collection

### ReputationSystem

Manages reputation scores for both creators and hunters.

Key responsibilities:

- Tracking user reputation
- Updating scores based on bounty completion
- Providing reputation-based access controls

## Data Structures

### Bounty Structure

```cairo
struct Bounty {
    felt creator;
    felt title;
    felt description;
    felt category;
    felt reward_token;
    uint256 reward_amount;
    uint256 deadline;
    uint256 created_at;
    BountyStatus status;
    Application[] applications;
    felt selected_hunter;
}
```

### Application Structure

```cairo
struct Application {
    felt hunter;
    felt proposal;
    uint256 submitted_at;
    ApplicationStatus status;
}
```

### BountyStatus Enum

```cairo
enum BountyStatus {
    Open,
    InProgress,
    Completed,
    Cancelled,
    Expired
}
```

### ApplicationStatus Enum

```cairo
enum ApplicationStatus {
    Pending,
    Accepted,
    Rejected,
    Withdrawn
}
```

## Key Functions

### Bounty Creation

```cairo
func create_bounty(
    title: felt,
    description: felt,
    category: felt,
    reward_token: felt,
    reward_amount: uint256,
    deadline: uint256
) -> (bounty_address: felt) {
    // Implementation details
}
```

### Application Submission

```cairo
func submit_application(proposal: felt) {
    // Implementation details
}
```

### Application Review

```cairo
func review_application(
    application_index: felt,
    status: ApplicationStatus
) {
    // Implementation details
}
```

### Bounty Completion

```cairo
func complete_bounty(submission: felt) {
    // Implementation details
}
```

### Payment Distribution

```cairo
func distribute_payment(hunter: felt) {
    // Implementation details
}
```

## Events

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

## Security Considerations

1. **Reentrancy Protection**: All external calls that transfer funds should be protected against reentrancy attacks.

2. **Access Control**: Ensure only authorized parties can perform sensitive operations:

   - Only creators can review applications
   - Only selected hunters can complete bounties
   - Only contract owners can update platform parameters

3. **Deadline Validation**: Always check that deadlines haven't passed before allowing certain operations.

4. **Payment Validation**: Validate all payment amounts and ensure escrow balances are sufficient.

5. **Integer Overflow**: Use safe math operations for all numeric calculations.

## Deployment

### Prerequisites

- StarkNet CLI installed
- Cairo compiler
- Testnet account with STRK tokens

### Deployment Steps

1. Deploy the BountyRegistry contract
2. Deploy the BountyFactory contract, linking it to the registry
3. Deploy the PaymentProcessor contract
4. Deploy the ReputationSystem contract
5. Update contract references as needed

### Example Deployment Script

```bash
# Deploy BountyRegistry
starknet deploy --contract BountyRegistry.json

# Deploy BountyFactory with registry address
starknet deploy --contract BountyFactory.json --inputs <registry_address>

# Deploy PaymentProcessor
starknet deploy --contract PaymentProcessor.json

# Deploy ReputationSystem
starknet deploy --contract ReputationSystem.json
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

## Integration Guide

### Frontend Integration

To integrate with the frontend, developers should:

1. **Connect to StarkNet**: Use starknet.js to connect to the network
2. **Load Contract ABIs**: Import the JSON ABI files for each contract
3. **Initialize Contracts**: Create contract instances using the addresses
4. **Call Functions**: Use the contract methods to interact with the blockchain

### Example Frontend Integration

```javascript
import { Contract, Account } from "starknet";
import bountyRegistryAbi from "./abis/BountyRegistry.json";

// Initialize contract
const bountyRegistry = new Contract(
  bountyRegistryAbi,
  bountyRegistryAddress,
  provider
);

// Read data
const bountyCount = await bountyRegistry.get_bounty_count();

// Write data
const { transaction_hash } = await account.execute({
  contractAddress: bountyFactoryAddress,
  entrypoint: "create_bounty",
  calldata: [title, description, category, rewardToken, rewardAmount, deadline],
});
```

### Backend Integration

For backend services, use starknet.js with a full node connection:

1. **Node Connection**: Connect to a StarkNet full node
2. **Event Monitoring**: Listen for contract events to track state changes
3. **Data Indexing**: Index relevant data for fast queries
4. **Notification System**: Send notifications based on events

### Example Backend Integration

```javascript
import { RpcProvider } from "starknet";

const provider = new RpcProvider({
  nodeUrl: "https://starknet-mainnet.infura.io/v3/YOUR_API_KEY",
});

// Listen for events
provider
  .getEvents({
    from_block: "latest",
    to_block: "latest",
    address: bountyRegistryAddress,
    keys: [["BountyCreated"]],
  })
  .then((events) => {
    // Process new bounties
    events.forEach((event) => {
      console.log("New bounty created:", event);
    });
  });
```

## Future Enhancements

1. **Multi-signature Escrow**: Implement multi-sig for large bounty payments
2. **Dispute Resolution**: Add arbitration mechanisms for contested bounties
3. **Token Staking**: Allow users to stake tokens for reputation boosting
4. **Cross-chain Compatibility**: Enable bounties payable in multiple token standards
5. **DAO Governance**: Implement community governance for platform parameters

## Contact and Support

For questions about the smart contracts or to report issues:

- GitHub: https://github.com/StarkEarn/contracts
- Discord: https://discord.gg/StarkEarn
- Email: contracts@StarkEarn.io

## License

This documentation and the associated smart contracts are licensed under the MIT License. See the LICENSE file for more details.
