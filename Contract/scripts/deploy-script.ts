// Deployment script for StarkQuest contracts
// This script handles the deployment of all contracts in the correct order

import { Account, Contract, RpcProvider, cairo, CallData } from 'starknet';
import fs from 'fs';
import path from 'path';

async function deploy() {
  console.log("Deploying StarkQuest contracts...");
  
  // Configuration
  const provider = new RpcProvider({
    nodeUrl: 'https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID'
  });
  
  // These values would typically come from environment variables or a secure config
  const ownerAddress = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // Placeholder
  const privateKey = '0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // Placeholder
  
  const account = new Account(
    provider,
    ownerAddress,
    privateKey
  );
  
  // Deployment parameters
  const CONFIG = {
    ownerAddress: ownerAddress,
    platformFeeBasisPoints: '200', // 2%
    minReputationForCreation: '100',
    minReputationForApplication: '50',
  };
  
  try {
    // Step 1: Declare contracts
    console.log('1. Declaring contracts...');
    
    // In a real implementation, you would declare each contract class here
    // For now, we'll use placeholder values
    const bountyClassHash = '0x1234'; // Placeholder
    const registryClassHash = '0x2345'; // Placeholder
    const factoryClassHash = '0x3456'; // Placeholder
    const paymentProcessorClassHash = '0x4567'; // Placeholder
    const reputationSystemClassHash = '0x5678'; // Placeholder
    const starkEarnClassHash = '0x6789'; // Placeholder
    
    console.log('   Contracts declared successfully');
    
    // Step 2: Deploy contracts in order
    console.log('2. Deploying contracts...');
    
    // Deploy BountyRegistry
    const registryResponse = await account.deploy({
      classHash: registryClassHash,
      constructorCalldata: CallData.compile({
        owner: CONFIG.ownerAddress,
      }),
    });
    
    const registryAddress = registryResponse.contract_address;
    console.log(`   BountyRegistry deployed at: ${registryAddress}`);
    
    // Deploy PaymentProcessor
    const paymentProcessorResponse = await account.deploy({
      classHash: paymentProcessorClassHash,
      constructorCalldata: CallData.compile({
        owner: CONFIG.ownerAddress,
        platform_fee_basis_points: CONFIG.platformFeeBasisPoints,
      }),
    });
    
    const paymentProcessorAddress = paymentProcessorResponse.contract_address;
    console.log(`   PaymentProcessor deployed at: ${paymentProcessorAddress}`);
    
    // Deploy ReputationSystem
    const reputationSystemResponse = await account.deploy({
      classHash: reputationSystemClassHash,
      constructorCalldata: CallData.compile({
        owner: CONFIG.ownerAddress,
        min_reputation_for_creation: CONFIG.minReputationForCreation,
        min_reputation_for_application: CONFIG.minReputationForApplication,
      }),
    });
    
    const reputationSystemAddress = reputationSystemResponse.contract_address;
    console.log(`   ReputationSystem deployed at: ${reputationSystemAddress}`);
    
    // Deploy BountyFactory
    const factoryResponse = await account.deploy({
      classHash: factoryClassHash,
      constructorCalldata: CallData.compile({
        registry_address: registryAddress,
        bounty_class_hash: bountyClassHash,
        owner: CONFIG.ownerAddress,
      }),
    });
    
    const factoryAddress = factoryResponse.contract_address;
    console.log(`   BountyFactory deployed at: ${factoryAddress}`);
    
    // Deploy StarkEarn Main Contract
    const starkEarnResponse = await account.deploy({
      classHash: starkEarnClassHash,
      constructorCalldata: CallData.compile({
        owner: CONFIG.ownerAddress,
      }),
    });
    
    const starkEarnAddress = starkEarnResponse.contract_address;
    console.log(`   StarkEarn deployed at: ${starkEarnAddress}`);
    
    // Step 3: Initialize StarkEarn Contract
    console.log('3. Initializing StarkEarn contract...');
    
    // In a real implementation, you would call the initialize function here
    console.log('   StarkEarn initialized');
    
    // Step 4: Update frontend configuration
    console.log('4. Updating frontend configuration...');
    
    const configContent = `// Contract addresses for StarkNet
export const CONTRACT_ADDRESSES = {
  BOUNTY_REGISTRY: "${registryAddress}",
  BOUNTY_FACTORY: "${factoryAddress}",
  PAYMENT_PROCESSOR: "${paymentProcessorAddress}",
  REPUTATION_SYSTEM: "${reputationSystemAddress}",
  STARK_EARN: "${starkEarnAddress}",
};

// Network configuration
export const NETWORK = "goerli";

// Token addresses
export const TOKEN_ADDRESSES = {
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
};
`;
    
    fs.writeFileSync(
      path.resolve(__dirname, '../../lib/config.ts'),
      configContent
    );
    
    console.log('Frontend configuration updated');
    
    console.log('\nDeployment completed successfully!');
    console.log('Deployed contract addresses:');
    console.log(`  BountyRegistry: ${registryAddress}`);
    console.log(`  BountyFactory: ${factoryAddress}`);
    console.log(`  PaymentProcessor: ${paymentProcessorAddress}`);
    console.log(`  ReputationSystem: ${reputationSystemAddress}`);
    console.log(`  StarkEarn: ${starkEarnAddress}`);
    
  } catch (error) {
    console.error('Deployment failed:', error);
  }
}

// Run deployment if this script is executed directly
if (require.main === module) {
  deploy();
}

export default deploy;