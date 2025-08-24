## ⚠️ Heads up!
You may see a "Dangerous site" warning when visiting our free Vercel preview link.  
This is because the app is currently hosted on a temporary Vercel domain (not yet our official custom domain).  
👉 To continue:
- Click **"Details"**  
- Then click **"Visit this unsafe site"** (Chrome wording may vary)
⚡ Don’t worry — StarkEarn is safe.  
Once we move to our main domain, this warning will disappear.
# StarkEarn - Decentralized Bounty Platform




StarkEarn is a decentralized bounty platform built on StarkNet that connects developers, designers, and other professionals with organizations and individuals who need work done. This platform leverages StarkNet's scalability and security to create a trustless environment for bounty creation, fulfillment, and payment.

![StarkEarn Banner](public/logo.jpg)

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Smart Contracts](#smart-contracts)
6. [Frontend](#frontend)
7. [Backend Services](#backend-services)
8. [Getting Started](#getting-started)
9. [Deployment](#deployment)
10. [Testing](#testing)
11. [Contributing](#contributing)
12. [Documentation](#documentation)
13. [License](#license)
14. [Support](#support)

## Overview

StarkEarn revolutionizes how bounties are created, managed, and fulfilled by leveraging the power of StarkNet. The platform provides a secure, transparent, and efficient way for project creators to find skilled contributors and for contributors to discover rewarding opportunities.

### How It Works

1. **Create Bounties**: Project creators post bounties with detailed requirements, rewards, and deadlines
2. **Apply to Bounties**: Skilled contributors submit applications showcasing their expertise
3. **Collaborate**: Creators review applications and select the best candidates
4. **Complete Work**: Contributors submit their work for review
5. **Get Paid**: Upon approval, rewards are automatically distributed via smart contracts

## Key Features

- **Decentralized**: Built on StarkNet for maximum security and transparency
- **Trustless Payments**: Smart contract escrow ensures fair payment distribution
- **Reputation System**: Build your reputation through successful bounty completions
- **Multi-Asset Support**: Accept payments in STRK, ETH, and other StarkNet tokens
- **Real-time Updates**: Event-driven architecture for instant notifications
- **Mobile Responsive**: Works seamlessly across all devices

## Architecture

StarkEarn follows a three-tier architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Frontend      │    │   Smart Contracts│    │   Backend        │
│   (Next.js)     │◄──►│   (Cairo)        │◄──►│   (Node.js)      │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```

### Components

1. **Smart Contracts**: Written in Cairo and deployed on StarkNet
2. **Frontend**: Next.js application for user interaction
3. **Backend Services**: Node.js services for event monitoring and data indexing

## Project Structure

```
.
├── Contract/                 # Cairo smart contracts
│   ├── src/                  # Contract source files
│   ├── scripts/              # Deployment and utility scripts
│   ├── tests/                # Contract tests
│   └── abis/                 # Contract ABIs
├── app/                      # Next.js frontend pages
│   ├── bounties/             # Bounty browsing pages
│   ├── dashboard/            # User dashboards
│   ├── post-bounty/          # Bounty creation pages
│   └── ...                   # Other page routes
├── components/               # Reusable UI components
├── lib/                      # Utility functions and services
│   ├── services/             # StarkNet integration services
│   └── abis/                 # Contract ABIs for frontend
├── docs/                     # Project documentation
└── public/                   # Static assets
```

## Smart Contracts

The StarkEarn smart contract system consists of a simplified single contract approach:

### StarkEarn Minimal

A consolidated contract that handles all bounty functionality:

- Bounty details management
- Application handling
- Submission and review process
- Payment distribution
- Escrow management

For detailed information about the smart contracts, see [Smart Contracts Documentation](docs/smart-contracts/README.md).

## Frontend

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

For detailed frontend integration instructions, see [Frontend Integration Guide](FRONTEND_INTEGRATION.md).

## Backend Services

The backend services provide additional functionality that enhances the user experience:

### Event Monitor

Monitors StarkNet for contract events and indexes relevant data.

### Data Indexing

Indexes data for fast search and retrieval.

### User Management

Manages user profiles and preferences.

For detailed backend implementation instructions, see [Backend Guide](docs/backend-guide.md).

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A StarkNet wallet (ArgentX or Braavos)
- Some STRK or ETH tokens for gas fees on StarkNet Goerli testnet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/StarkEarn.git
   cd StarkEarn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

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

For detailed deployment instructions, see [Deployment Guide](DEPLOYMENT_GUIDE.md).

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

### Smart Contract Testing

```bash
cd Contract
snforge test
```

## Contributing

We welcome contributions to StarkEarn! Here's how you can help:

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for your changes
5. Submit a pull request

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/StarkEarn.git
   cd StarkEarn
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

### Frontend Development

1. Make changes to React components in `app/` and `components/`
2. Update services in `lib/services/` as needed
3. Test changes with the development server

### Backend Development

1. Implement backend services in `services/`
2. Update event monitoring in `services/event-monitor.ts`
3. Test with the development server

## Documentation

For more detailed information about specific aspects of the project, please refer to the following documentation:

- [Smart Contracts Documentation](docs/smart-contracts/README.md) - Detailed information about the Cairo smart contracts
- [Backend Guide](docs/backend-guide.md) - Instructions for backend developers
- [Frontend Integration Guide](FRONTEND_INTEGRATION.md) - Guide for frontend integration with smart contracts
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [Smart Contract Integration](docs/smart-contract-integration.md) - Additional smart contract integration details

## License

MIT License

## Support

For questions about StarkEarn:

- GitHub Issues: https://github.com/your-username/StarkEarn/issues
- Discord: https://discord.gg/StarkEarn
- Email: support@StarkEarn.io
