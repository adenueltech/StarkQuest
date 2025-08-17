# StarkEarn - Decentralized Bounty Platform

StarkEarn is a decentralized bounty platform built on StarkNet that connects project creators with skilled developers, designers, and other contributors. This repository contains the frontend implementation of the platform.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Smart Contract Integration Points](#smart-contract-integration-points)
4. [Backend Integration Points](#backend-integration-points)
5. [Getting Started](#getting-started)
6. [Development Guide](#development-guide)
7. [Folder Structure](#folder-structure)
8. [Contributing](#contributing)

## Project Overview

StarkEarn allows users to:

- Connect their StarkNet wallet (ArgentX or Braavos)
- Create bounties with rewards in STRK, ETH, or other tokens
- Apply for bounties as a contributor
- Review applications as a bounty creator
- Complete bounties and receive payments
- Build reputation through successful bounty completion

## Frontend Architecture

The frontend is built with:

- Next.js 13+ (App Router)
- TypeScript
- TailwindCSS
- StarkNet.js for blockchain interactions
- Shadcn/ui component library

### Key Components

1. **Wallet Integration** (`components/wallet-connect.tsx`)

   - Connects to StarkNet wallets
   - Manages wallet state and authentication

2. **Authentication** (`contexts/auth-context.tsx`)

   - Wallet-based authentication
   - User session management

3. **Bounty Creation** (`app/post-bounty/page.tsx`)

   - Form for creating new bounties
   - Integrates with smart contracts

4. **Bounty Management** (`app/bounties/`)

   - Browse and search bounties
   - Apply for bounties

5. **User Dashboard** (`app/dashboard/`)
   - Creator and hunter dashboards
   - Track active bounties and earnings

## Smart Contract Integration Points

The frontend integrates with several smart contracts. These contracts need to be deployed by the smart contract developer.

### Required Smart Contracts

1. **BountyRegistry**

   - Tracks all bounties in the system
   - Provides search and filtering capabilities
   - Located in `lib/abis/BountyRegistry.json`

2. **BountyFactory**

   - Factory contract for creating new bounties
   - Located in `lib/abis/BountyFactory.json`

3. **Bounty (Individual Contract)**

   - Each bounty has its own contract instance
   - Handles applications, submissions, and payments
   - Located in `lib/abis/Bounty.json`

4. **PaymentProcessor**

   - Handles payments and escrow
   - Located in `lib/abis/PaymentProcessor.json`

5. **ReputationSystem**
   - Manages user reputation scores
   - Located in `lib/abis/ReputationSystem.json`

### Integration Service

The `lib/services/starknet.ts` file contains all blockchain interaction logic:

- Wallet connection
- Contract initialization
- Function calls to smart contracts

### Key Integration Points

1. **Wallet Connection** (`components/wallet-connect.tsx`)

   - Connects to StarkNet wallets
   - Gets user account information

2. **Bounty Creation** (`app/post-bounty/page.tsx`)

   - Calls `create_bounty` function on BountyFactory contract
   - Requires connected wallet

3. **Bounty Application** (Not yet implemented in UI)

   - Will call `submit_application` function on individual Bounty contracts
   - Requires connected wallet

4. **Application Review** (Not yet implemented in UI)

   - Will call `review_application` function on individual Bounty contracts
   - Requires connected wallet

5. **Bounty Completion** (Not yet implemented in UI)

   - Will call `complete_bounty` function on individual Bounty contracts
   - Requires connected wallet

6. **Payment Distribution** (Not yet implemented in UI)
   - Will call `distribute_payment` function on PaymentProcessor contract
   - Requires connected wallet

## Backend Integration Points

While most functionality is handled by smart contracts, some features require backend services:

### Event Monitoring

- Monitor blockchain events for:
  - New bounties
  - New applications
  - Bounty completions
  - Payment distributions
- Index data for fast queries

### Notification System

- Send notifications based on blockchain events
- Email or in-app notifications

### Data Indexing

- Index relevant data for fast queries
- Cache frequently accessed information

### API Endpoints Needed

1. **User Profile Management**

   - Update user profile information
   - Store social media links and skills

2. **Search Indexing**

   - Index bounty content for search
   - Index user skills and expertise

3. **Notifications**

   - Store and manage user notifications
   - Send email notifications

4. **Analytics**
   - Track platform usage statistics
   - Generate reports and insights

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm package manager
- StarkNet wallet (ArgentX or Braavos)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd StarkEarn-frontend
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# StarkNet RPC endpoint
NEXT_PUBLIC_STARKNET_RPC_URL=https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Contract addresses (to be updated by smart contract developer)
NEXT_PUBLIC_BOUNTY_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_BOUNTY_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_PAYMENT_PROCESSOR_ADDRESS=0x...
NEXT_PUBLIC_REPUTATION_SYSTEM_ADDRESS=0x...
```

## Development Guide

### Adding New Features

1. **UI Components**

   - Add new components to the `components/` directory
   - Use shadcn/ui components when possible
   - Follow existing styling patterns

2. **Pages**

   - Add new pages to the `app/` directory
   - Follow Next.js App Router conventions

3. **Smart Contract Integration**
   - Add new ABI files to `lib/abis/`
   - Update `lib/services/starknet.ts` with new functions
   - Create new UI components for contract interactions

### Styling

- Use TailwindCSS for styling
- Follow the existing color scheme (starknet-blue, starknet-orange, starknet-pink)
- Use shadcn/ui components for consistent UI elements

### State Management

- Use React Context for global state (auth, theme, etc.)
- Use React useState for local component state
- Use localStorage for persistent client-side data (when not handled by smart contracts)

## Folder Structure

```
StarkEarn-frontend/
├── app/                    # Next.js app router pages
│   ├── bounties/          # Bounty browsing and management
│   ├── dashboard/         # User dashboards
│   ├── post-bounty/       # Bounty creation
│   └── ...                # Other pages
├── components/            # React components
├── contexts/              # React contexts
├── lib/                   # Utility functions and services
│   ├── abis/              # Smart contract ABIs
│   └── services/          # Service layer (starknet integration)
├── public/                # Static assets
└── styles/                # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Write clear comments for complex logic
- Use meaningful variable and function names

### Testing

- Test all new features in a StarkNet testnet environment
- Ensure wallet integration works with both ArgentX and Braavos
- Verify error handling for common scenarios

## Smart Contract Developer Notes

For the smart contract developer:

1. **Contract Addresses**

   - Update contract addresses in `lib/config.ts`
   - Update environment variables in `.env.local`

2. **ABI Compatibility**

   - Ensure deployed contract ABIs match the JSON files in `lib/abis/`
   - Update ABIs if contract interfaces change

3. **Event Emission**

   - Emit events for all important state changes
   - Follow event naming conventions in the existing ABI files

4. **Error Handling**
   - Implement clear error messages in contracts
   - Handle common error cases (insufficient funds, unauthorized access, etc.)

## Backend Developer Notes

For the backend developer:

1. **Event Monitoring**

   - Monitor all events emitted by smart contracts
   - Index data for fast queries
   - Handle event processing failures gracefully

2. **API Design**

   - Follow RESTful API principles
   - Use consistent naming conventions
   - Implement proper error handling and validation

3. **Data Storage**

   - Store only data that cannot be retrieved from the blockchain
   - Implement proper database indexing
   - Ensure data consistency with blockchain state

4. **Security**
   - Implement proper authentication for API endpoints
   - Validate all input data
   - Protect against common web vulnerabilities

## Future Enhancements

1. **Multi-signature Escrow**

   - Implement multi-sig for large bounty payments

2. **Dispute Resolution**

   - Add arbitration mechanisms for contested bounties

3. **Token Staking**

   - Allow users to stake tokens for reputation boosting

4. **Cross-chain Compatibility**

   - Enable bounties payable in multiple token standards

5. **DAO Governance**
   - Implement community governance for platform parameters
