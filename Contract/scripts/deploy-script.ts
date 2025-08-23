// Deployment script for StarkQuest contracts
// This script handles the deployment of all contracts in the correct order

import { Account, RpcProvider, CallData, stark } from 'starknet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
console.log("Environment variables loaded:");
console.log("STARKNET_NODE_URL:", process.env.STARKNET_NODE_URL ? "SET" : "NOT SET");
console.log("OWNER_ADDRESS:", process.env.OWNER_ADDRESS ? "SET" : "NOT SET");
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY ? "SET" : "NOT SET");

async function deploy() {
  console.log("Starting StarkQuest contract deployment...");
  
  // Configuration
  console.log("Setting up provider...");
  const provider = new RpcProvider({
    nodeUrl: process.env.STARKNET_NODE_URL || 'https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID'
  });
  console.log("Provider set up successfully");
  
  // These values would typically come from environment variables or a secure config
  const ownerAddress = process.env.OWNER_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;
  
  console.log("Checking required environment variables...");
  if (!ownerAddress || !privateKey) {
    console.error('OWNER_ADDRESS and PRIVATE_KEY must be set in environment variables');
    console.log("OWNER_ADDRESS:", ownerAddress);
    console.log("PRIVATE_KEY:", privateKey ? "SET" : "NOT SET");
    return;
  }
  console.log("Environment variables validated");
  
  console.log("Setting up account...");
  const account = new Account(
    provider,
    ownerAddress,
    privateKey
  );
  console.log("Account set up successfully");
  
  // Deployment parameters
  const CONFIG = {
    ownerAddress: ownerAddress,
    platformFeeBasisPoints: process.env.PLATFORM_FEE_BASIS_POINTS || '200', // 2%
    minReputationForCreation: process.env.MIN_REPUTATION_FOR_CREATION || '100',
    minReputationForApplication: process.env.MIN_REPUTATION_FOR_APPLICATION || '50',
  };
  console.log("Configuration set:", CONFIG);
  
  try {
    // Step 1: Declare contracts
    console.log('1. Declaring contracts...');
    
    // Helper function to declare contract with CASM if available
    const declareContract = async (contractName: string) => {
      console.log(`Declaring contract: ${contractName}`);
      // Try the new naming convention first
      let contractPath = path.resolve(__dirname, `../target/dev/${contractName}_HelloStarknet.contract_class.json`);
      let casmPath = path.resolve(__dirname, `../target/dev/${contractName}_HelloStarknet.compiled_contract_class.json`);
      
      // If the new naming convention files don't exist, try the old naming convention
      if (!fs.existsSync(contractPath)) {
        console.log(`  Trying old naming convention for ${contractName}`);
        contractPath = path.resolve(__dirname, `../target/dev/${contractName}.contract_class.json`);
        casmPath = path.resolve(__dirname, `../target/dev/${contractName}.compiled_contract_class.json`);
      }
      
      console.log(`  Contract path: ${contractPath}`);
      console.log(`  CASM path: ${casmPath}`);
      
      if (!fs.existsSync(contractPath)) {
        throw new Error(`Contract file not found: ${contractPath}`);
      }
      
      const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));
      console.log(`  Contract JSON loaded for ${contractName}`);
      
      // Check if CASM file exists
      if (fs.existsSync(casmPath)) {
        console.log(`  CASM file found for ${contractName}`);
        const casmJson = JSON.parse(fs.readFileSync(casmPath, 'utf-8'));
        console.log(`  Declaring ${contractName} with CASM...`);
        return await account.declare({
          contract: contractJson,
          casm: casmJson,
        });
      } else {
        // Try without CASM (might work for simple contracts)
        console.log(`   Warning: No CASM file found for ${contractName}, trying without it...`);
        return await account.declare({
          contract: contractJson,
        });
      }
    };
    
    // Declare each contract class
    console.log('Declaring bounty contract...');
    const bountyClassHash = await declareContract('bounty');
    console.log('Bounty contract declared:', bountyClassHash.class_hash);
    
    console.log('Declaring bounty_registry contract...');
    const registryClassHash = await declareContract('bounty_registry');
    console.log('Bounty registry contract declared:', registryClassHash.class_hash);
    
    console.log('Declaring bounty_factory contract...');
    const factoryClassHash = await declareContract('bounty_factory');
    console.log('Bounty factory contract declared:', factoryClassHash.class_hash);
    
    console.log('Declaring payment_processor contract...');
    const paymentProcessorClassHash = await declareContract('payment_processor');
    console.log('Payment processor contract declared:', paymentProcessorClassHash.class_hash);
    
    console.log('Declaring reputation_system contract...');
    const reputationSystemClassHash = await declareContract('reputation_system');
    console.log('Reputation system contract declared:', reputationSystemClassHash.class_hash);
    
    console.log('Declaring stark_earn contract...');
    const starkEarnClassHash = await declareContract('stark_earn');
    console.log('Stark earn contract declared:', starkEarnClassHash.class_hash);
    
    console.log('   Contracts declared successfully');
    
    // Step 2: Deploy contracts in order
    console.log('2. Deploying contracts...');
    
    // Deploy BountyRegistry
    console.log('Deploying BountyRegistry...');
    const registryResponse = await account.deploy({
      classHash: registryClassHash.class_hash,
      constructorCalldata: CallData.compile({
        owner: CONFIG.ownerAddress,
      }),
    });
    
    // Handle potential array return type with type assertion
    const registryAddress = (Array.isArray(registryResponse.contract_address) 
      ? registryResponse.contract_address[0] 
      : registryResponse.contract_address) as string;
    console.log(`   BountyRegistry deployed at: ${registryAddress}`);
    
    // Deploy PaymentProcessor
    console.log('Deploying PaymentProcessor...');
    const paymentProcessorResponse = await account.deploy({
      classHash: paymentProcessorClassHash.class_hash,
      constructorCalldata: CallData.compile({
        owner: CONFIG.ownerAddress,
        platform_fee_basis_points: CONFIG.platformFeeBasisPoints,
      }),
    });
    
    // Handle potential array return type with type assertion
    const paymentProcessorAddress = (Array.isArray(paymentProcessorResponse.contract_address) 
      ? paymentProcessorResponse.contract_address[0] 
      : paymentProcessorResponse.contract_address) as string;
    console.log(`   PaymentProcessor deployed at: ${paymentProcessorAddress}`);
    
    // Deploy ReputationSystem
    console.log('Deploying ReputationSystem...');
    const reputationSystemResponse = await account.deploy({
      classHash: reputationSystemClassHash.class_hash,
      constructorCalldata: CallData.compile({
        owner: CONFIG.ownerAddress,
        min_reputation_for_creation: CONFIG.minReputationForCreation,
        min_reputation_for_application: CONFIG.minReputationForApplication,
      }),
    });
    
    // Handle potential array return type with type assertion
    const reputationSystemAddress = (Array.isArray(reputationSystemResponse.contract_address) 
      ? reputationSystemResponse.contract_address[0] 
      : reputationSystemResponse.contract_address) as string;
    console.log(`   ReputationSystem deployed at: ${reputationSystemAddress}`);
    
    // Deploy BountyFactory
    console.log('Deploying BountyFactory...');
    const factoryResponse = await account.deploy({
      classHash: factoryClassHash.class_hash,
      constructorCalldata: CallData.compile({
        registry_address: registryAddress,
        bounty_class_hash: bountyClassHash.class_hash,
        owner: CONFIG.ownerAddress,
      }),
    });
    
    // Handle potential array return type with type assertion
    const factoryAddress = (Array.isArray(factoryResponse.contract_address) 
      ? factoryResponse.contract_address[0] 
      : factoryResponse.contract_address) as string;
    console.log(`   BountyFactory deployed at: ${factoryAddress}`);
    
    // Deploy StarkEarn Main Contract
    console.log('Deploying StarkEarn...');
    const starkEarnResponse = await account.deploy({
      classHash: starkEarnClassHash.class_hash,
      constructorCalldata: CallData.compile({
        owner: CONFIG.ownerAddress,
      }),
    });
    
    // Handle potential array return type with type assertion
    const starkEarnAddress = (Array.isArray(starkEarnResponse.contract_address) 
      ? starkEarnResponse.contract_address[0] 
      : starkEarnResponse.contract_address) as string;
    console.log(`   StarkEarn deployed at: ${starkEarnAddress}`);
    
    // Step 3: Initialize StarkEarn Contract
    console.log('3. Initializing StarkEarn contract...');
    
    // Initialize the StarkEarn contract with the addresses of the other contracts
    console.log('Initializing StarkEarn with contract addresses...');
    await account.execute({
      contractAddress: starkEarnAddress,
      entrypoint: 'initialize',
      calldata: [
        registryAddress,
        factoryAddress,
        paymentProcessorAddress,
        reputationSystemAddress,
        bountyClassHash.class_hash
      ]
    });
    
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
    
    console.log('Writing config to ../../lib/config.ts');
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

// Always run deployment when this script is executed directly
console.log("Running deployment...");
deploy();

export default deploy;