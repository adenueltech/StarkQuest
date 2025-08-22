# StarkQuest Deployment Guide

This guide will help you deploy the StarkQuest smart contracts and configure the application.

## Prerequisites

1. Node.js (v16 or higher)
2. npm or yarn
3. A StarkNet wallet (ArgentX or Braavos)
4. Some STRK or ETH tokens for gas fees on StarkNet Goerli testnet
5. An Infura account with a StarkNet project (for RPC access)

## Setup Environment Variables

Create a `.env` file in the `Contract` directory with the following variables:

```env
STARKNET_NODE_URL=https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID
OWNER_ADDRESS=0xYourWalletAddress
PRIVATE_KEY=0xYourPrivateKey
PLATFORM_FEE_BASIS_POINTS=200
MIN_REPUTATION_FOR_CREATION=100
MIN_REPUTATION_FOR_APPLICATION=50
```

## Deploying the Contracts

1. Install dependencies:
   ```bash
   cd Contract
   npm install
   ```

2. Compile the contracts:
   ```bash
   scarb build
   ```

3. Run the deployment script:
   ```bash
   ts-node scripts/deploy-script.ts
   ```

## Post-Deployment Configuration

After deployment, the script will automatically update `lib/config.ts` with the deployed contract addresses. You can now run the frontend application.

## Running the Application

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

## Monitoring Events

The backend service includes an event monitor that listens for contract events. To start the backend service:

```bash
npm run start
```

## Troubleshooting

### Common Issues

1. **Insufficient funds**: Make sure your wallet has enough STRK or ETH tokens for gas fees.

2. **Network issues**: If you're having trouble connecting to StarkNet, try changing the RPC URL in your environment variables.

3. **Contract declaration failed**: This might happen if you're trying to declare a contract that's already declared. The deployment script handles this with `declareIfNot`.

4. **Permission errors**: Make sure your wallet address is the owner of the contracts.

### Need Help?

If you encounter any issues during deployment, please check the console output for error messages. Common issues include:

- Invalid private key or wallet address
- Insufficient funds for gas fees
- Network connectivity issues
- Contract compilation errors

For further assistance, you can:
1. Check the StarkNet documentation
2. Consult the StarkNet community forums
3. Reach out to the StarkNet support team