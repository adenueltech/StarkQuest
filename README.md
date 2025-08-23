# StarkQuest - Decentralized Bounty Platform

StarkQuest is a decentralized bounty platform built on StarkNet that connects developers, designers, and other professionals with organizations and individuals who need work done. This platform leverages StarkNet's scalability and security to create a trustless environment for bounty creation, fulfillment, and payment.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Smart Contracts](#smart-contracts)
3. [Frontend Integration](#frontend-integration)
4. [Backend Services](#backend-services)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Contributing](#contributing)

## Architecture Overview

StarkQuest consists of three main components:

1. **Smart Contracts**: Written in Cairo and deployed on StarkNet
2. **Frontend**: Next.js application for user interaction
3. **Backend Services**: Node.js services for event monitoring and data indexing

## Smart Contracts

The StarkQuest smart contract system consists of several interconnected contracts:

### 1. BountyRegistry

Central registry that keeps track of all bounties in the system.

### 2. BountyFactory

Factory contract responsible for creating new bounty instances using the clone pattern for gas efficiency.

### 3. Bounty (Individual Contract)

Each bounty has its own contract instance with functionality for:

- Bounty details management
- Application handling
- Submission and review process
- Payment distribution

### 4. PaymentProcessor

Handles all payment-related operations including escrow and distribution.

### 5. ReputationSystem

Manages reputation scores for both creators and hunters.

### 6. StarkEarn (Main Contract)

Main entry point that coordinates the entire system.

## Frontend Integration

The frontend is built with Next.js and uses starknet.js to interact with the smart contracts.

### Key Components

1. **Wallet Connection**: Connects to StarkNet wallets (ArgentX, Braavos)
2. **Bounty Creation**: Interface for creating new bounties
3. **Bounty Browsing**: Browse and search available bounties
4. **Application System**: Apply to bounties and manage applications
5. **Payment Integration**: Handle payments and escrow

### Services

The frontend uses several services to interact with the smart contracts:

- `lib/services/starknet.ts`: Core StarkNet interaction service
- `lib/services/bounty-service.ts`: Bounty-specific functions

## Backend Services

The backend services provide additional functionality that enhances the user experience:

### Event Monitor

Monitors StarkNet for contract events and indexes relevant data.

### Data Indexing

Indexes data for fast search and retrieval.

### User Management

Manages user profiles and preferences.

## Deployment

### Prerequisites

1. Install Scarb (Cairo package manager):

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh
   ```

2. Install Starknet Foundry:

   ```bash
   curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh
   ```

3. Set up a StarkNet wallet with funds (Goerli ETH for testnet deployment)

### Deployment Steps

1. Compile Contracts:

   ```bash
   cd Contract
   scarb build
   ```

2. Deploy Contracts:
   Use the deployment script:

   ```bash
   ts-node Contract/scripts/deploy-script.ts
   ```

3. Update Frontend Configuration:
   The deployment script automatically updates `lib/config.ts` with the deployed contract addresses.

## Testing

### Running Integration Tests

```bash
npm run test
```

### Manual Testing

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Connect your StarkNet wallet (ArgentX or Braavos)

3. Create a new bounty using the "Create Bounty" form

4. Apply to bounties as a hunter

5. Review applications as a bounty creator

6. Complete bounties and receive payments

## Contributing

We welcome contributions to StarkQuest! Here's how you can help:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for your changes
5. Submit a pull request

### Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/starkquest.git
   cd starkquest
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Code Structure

- `Contract/`: Cairo smart contracts
- `app/`: Next.js frontend pages and components
- `components/`: Reusable UI components
- `lib/`: Utility functions and services
- `services/`: Backend services
- `tests/`: Integration and unit tests

### Smart Contract Development

1. Make changes to the Cairo contracts in `Contract/src/`
2. Compile contracts:
   ```bash
   cd Contract
   scarb build
   ```
3. Run contract tests:
   ```bash
   cd Contract
   snforge test
   ```

## License

MIT License

## Support

For questions about StarkQuest:

- GitHub Issues: https://github.com/your-username/starkquest/issues
- Discord: https://discord.gg/StarkQuest
- Email: support@starkquest.io
