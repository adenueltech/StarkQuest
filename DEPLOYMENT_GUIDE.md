# StarkQuest Smart Contract Deployment Guide

This guide provides step-by-step instructions for deploying the StarkQuest smart contracts to StarkNet.

## Prerequisites

1. Install Scarb (Cairo package manager):
```bash
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh
```

2. Install Starknet Foundry:
```bash
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh
```

3. Set up a StarkNet wallet with funds (Goerli ETH for testnet deployment)

## Deployment Steps

### 1. Compile Contracts

Navigate to the Contract directory and compile all contracts:

```bash
cd Contract
scarb build
```

### 2. Deploy Contracts in Order

The contracts must be deployed in a specific order due to dependencies:

#### Step 1: Deploy Bounty Contract (Template)
First, declare the bounty contract as a class for cloning:

```bash
starknet declare \
  --contract target/dev/starkquest_bounty.sierra.json \
  --account account.json \
  --keystore keystore.json \
  --network goerli
```

Note the class hash from the output.

#### Step 2: Deploy BountyRegistry

```bash
starknet deploy \
  --class-hash <bounty_registry_class_hash> \
  --inputs <owner_address> \
  --account account.json \
  --keystore keystore.json \
  --network goerli
```

Note the deployed contract address.

#### Step 3: Deploy PaymentProcessor

```bash
starknet deploy \
  --class-hash <payment_processor_class_hash> \
  --inputs <owner_address> <platform_fee_basis_points> \
  --account account.json \
  --keystore keystore.json \
  --network goerli
```

Note the deployed contract address.

#### Step 4: Deploy ReputationSystem

```bash
starknet deploy \
  --class-hash <reputation_system_class_hash> \
  --inputs <owner_address> <min_reputation_for_creation> <min_reputation_for_application> \
  --account account.json \
  --keystore keystore.json \
  --network goerli
```

Note the deployed contract address.

#### Step 5: Deploy BountyFactory

```bash
starknet deploy \
  --class-hash <bounty_factory_class_hash> \
  --inputs <registry_address> <bounty_class_hash> <owner_address> \
  --account account.json \
  --keystore keystore.json \
  --network goerli
```

Note the deployed contract address.

#### Step 6: Deploy StarkEarn Main Contract

```bash
starknet deploy \
  --class-hash <stark_earn_class_hash> \
  --inputs <owner_address> \
  --account account.json \
  --keystore keystore.json \
  --network goerli
```

Note the deployed contract address.

#### Step 7: Initialize StarkEarn Contract

Call the initialize function on the StarkEarn contract:

```bash
starknet invoke \
  --address <stark_earn_address> \
  --abi target/dev/starkquest_stark_earn.abi.json \
  --function initialize \
  --inputs <registry_address> <factory_address> <payment_processor_address> <reputation_system_address> <bounty_class_hash> \
  --account account.json \
  --keystore keystore.json \
  --network goerli
```

### 3. Update Frontend Configuration

Update the contract addresses in `lib/config.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  BOUNTY_REGISTRY: "<deployed_registry_address>",
  BOUNTY_FACTORY: "<deployed_factory_address>",
  PAYMENT_PROCESSOR: "<deployed_payment_processor_address>",
  REPUTATION_SYSTEM: "<deployed_reputation_system_address>",
  STARK_EARN: "<deployed_stark_earn_address>"
};
```

### 4. Generate ABI Files

Extract the ABI files from the compiled contracts and place them in `lib/abis/`:

```bash
# Copy ABI files from target/dev/ to lib/abis/
cp target/dev/starkquest_bounty_registry.abi.json ../lib/abis/BountyRegistry.json
cp target/dev/starkquest_bounty_factory.abi.json ../lib/abis/BountyFactory.json
cp target/dev/starkquest_bounty.abi.json ../lib/abis/Bounty.json
cp target/dev/starkquest_payment_processor.abi.json ../lib/abis/PaymentProcessor.json
cp target/dev/starkquest_reputation_system.abi.json ../lib/abis/ReputationSystem.json
cp target/dev/starkquest_stark_earn.abi.json ../lib/abis/StarkEarn.json
```

## Testing Deployment

After deployment, test the contracts with:

```bash
# Test creating a bounty
starknet invoke \
  --address <stark_earn_address> \
  --abi target/dev/starkquest_stark_earn.abi.json \
  --function create_bounty \
  --inputs <title> <description> <reward_amount> <deadline> <token_address> \
  --account account.json \
  --keystore keystore.json \
  --network goerli
```

## Troubleshooting

### Common Issues

1. **Insufficient funds**: Ensure your account has enough ETH for deployment
2. **Invalid class hash**: Make sure you're using the correct class hash from the declare command
3. **Network issues**: Check StarkNet network status if transactions are not confirming

### Useful Commands

Check transaction status:
```bash
starknet get_transaction_receipt --hash <transaction_hash> --network goerli
```

Check contract status:
```bash
starknet get_class_hash_at --contract-address <contract_address> --network goerli
```

## Next Steps

After successful deployment:
1. Update the frontend with real contract addresses
2. Test all contract functions through the frontend
3. Set up backend services to monitor events
4. Configure notifications and search indexing

## Security Considerations

1. Store private keys securely using keystore files
2. Use different accounts for deployment and operation
3. Verify contract code on StarkScan after deployment
4. Test thoroughly on testnet before mainnet deployment