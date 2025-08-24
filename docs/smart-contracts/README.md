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

The StarkEarn smart contract system now consists of a single contract:

1. **StarkEarn Minimal** - A simplified contract that handles all bounty functionality

## Core Contracts

### StarkEarn Minimal

A simplified contract that combines all functionality into a single contract with the following features:

Key responsibilities:

- Bounty details management
- Application handling
- Submission and review process
- Payment distribution
- Escrow management

## Data Structures

### Bounty Structure

```cairo
struct Bounty {
    felt title;
    felt description;
    uint256 reward_amount;
    uint64 deadline;
    ContractAddress token_address;
    BountyStatus status;
}
```

### Application Structure

```cairo
struct Application {
    ContractAddress applicant;
    uint64 timestamp;
    bool accepted;
}
```

### Submission Structure

```cairo
struct Submission {
    ContractAddress hunter;
    felt content;
    uint64 timestamp;
    bool approved;
}
```

### BountyStatus Enum

```cairo
enum BountyStatus {
    Open,
    InProgress,
    Completed,
    Cancelled,
}
```

## Key Functions

### Bounty Creation

```cairo
func create_bounty(
    title: felt,
    description: felt,
    reward_amount: uint256,
    deadline: uint64,
    token_address: ContractAddress
) -> (bounty_id: uint64) {
    // Implementation details
}
```

### Application Submission

```cairo
func submit_application(bounty_id: uint64) {
    // Implementation details
}
```

### Application Acceptance

```cairo
func accept_application(
    bounty_id: uint64,
    application_id: uint64
) {
    // Implementation details
}
```

### Work Submission

```cairo
func submit_work(
    bounty_id: uint64,
    content: felt
) {
    // Implementation details
}
```

### Submission Approval

```cairo
func approve_submission(
    bounty_id: uint64,
    submission_id: uint64
) {
    // Implementation details
}
```

### Bounty Cancellation

```cairo
func cancel_bounty(
    bounty_id: uint64,
    reason: felt
) {
    // Implementation details
}
```

## Events

### BountyCreated

Emitted when a new bounty is created.

```cairo
event BountyCreated {
    bounty_id: uint64,
    creator: ContractAddress,
    title: felt,
    reward_amount: uint256,
}
```

### ApplicationSubmitted

Emitted when a hunter submits an application.

```cairo
event ApplicationSubmitted {
    bounty_id: uint64,
    applicant: ContractAddress,
    timestamp: uint64,
}
```

### ApplicationAccepted

Emitted when a creator accepts an application.

```cairo
event ApplicationAccepted {
    bounty_id: uint64,
    applicant: ContractAddress,
    timestamp: uint64,
}
```

### SubmissionSubmitted

Emitted when a hunter submits work.

```cairo
event SubmissionSubmitted {
    bounty_id: uint64,
    hunter: ContractAddress,
    content: felt,
    timestamp: uint64,
}
```

### SubmissionApproved

Emitted when a creator approves a submission.

```cairo
event SubmissionApproved {
    bounty_id: uint64,
    hunter: ContractAddress,
    timestamp: uint64,
}
```

### BountyCompleted

Emitted when a bounty is marked as completed.

```cairo
event BountyCompleted {
    bounty_id: uint64,
    hunter: ContractAddress,
    reward_amount: uint256,
}
```

### BountyCancelled

Emitted when a bounty is cancelled.

```cairo
event BountyCancelled {
    bounty_id: uint64,
    reason: felt,
}
```

### PaymentProcessed

Emitted when payment is processed.

```cairo
event PaymentProcessed {
    bounty_id: uint64,
    hunter: ContractAddress,
    amount: uint256,
}
```

## Security Considerations

1. **Access Control**: Ensure only authorized parties can perform sensitive operations:

   - Only creators can accept applications
   - Only assigned hunters can submit work
   - Only creators can approve submissions
   - Only creators can cancel bounties

2. **Deadline Validation**: Always check that deadlines haven't passed before allowing certain operations.

3. **Payment Validation**: Validate all payment amounts and ensure escrow balances are sufficient.

4. **Integer Overflow**: Use safe math operations for all numeric calculations.

## Deployment

### Prerequisites

- StarkNet CLI installed
- Cairo compiler
- Testnet account with STRK tokens

### Deployment Steps

1. Deploy the StarkEarn Minimal contract

### Example Deployment Script

```bash
# Deploy StarkEarn Minimal
starknet deploy --contract StarkEarnMinimal.json
```

## Testing

### Unit Tests

The contract should have comprehensive unit tests covering:

- Happy path scenarios
- Edge cases
- Error conditions
- Security vulnerabilities

### Integration Tests

Test the contract functionality:

- Bounty creation
- Application submission and acceptance
- Work submission and approval
- Payment processing
- Bounty cancellation

### Test Coverage

Aim for at least 90% test coverage for all critical functions.

## Integration Guide

### Frontend Integration

To integrate with the frontend, developers should:

1. **Connect to StarkNet**: Use starknet.js to connect to the network
2. **Load Contract ABIs**: Import the JSON ABI files for the contract
3. **Initialize Contracts**: Create contract instances using the addresses
4. **Call Functions**: Use the contract methods to interact with the blockchain

### Example Frontend Integration

```javascript
import { Contract, Account } from "starknet";
import StarkEarnMinimalAbi from "./abis/StarkEarnMinimal.json";

// Initialize contract
const StarkEarnMinimal = new Contract(
  StarkEarnMinimalAbi,
  StarkEarnMinimalAddress,
  provider
);

// Read data
const bountyCount = await StarkEarnMinimal.get_bounty_count();

// Write data
const { transaction_hash } = await account.execute({
  contractAddress: StarkEarnMinimalAddress,
  entrypoint: "create_bounty",
  calldata: [title, description, rewardAmount, deadline, tokenAddress],
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
    address: StarkEarnMinimalAddress,
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

1. **Advanced Features**: Add more sophisticated bounty features as needed
2. **Performance Optimizations**: Optimize contract performance as the platform grows
3. **Security Audits**: Regular security audits to ensure contract safety

## Contact and Support

For questions about the smart contracts or to report issues:

- GitHub: https://github.com/StarkEarn/contracts
- Discord: https://discord.gg/StarkEarn
- Email: contracts@StarkEarn.io

## License

This documentation and the associated smart contracts are licensed under the MIT License. See the LICENSE file for more details.
