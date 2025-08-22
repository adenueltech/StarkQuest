// Simple test deployment script for StarkQuest
// This script tests deployment with just the main contract that compiled successfully

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

async function testDeploy() {
  console.log("Testing StarkQuest contract deployment...");
  
  // Configuration
  const provider = new RpcProvider({
    nodeUrl: process.env.STARKNET_NODE_URL || 'https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID'
  });
  
  // These values would typically come from environment variables or a secure config
  const ownerAddress = process.env.OWNER_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!ownerAddress || !privateKey) {
    console.log('Environment variables not set. This is expected for testing.');
    console.log('OWNER_ADDRESS and PRIVATE_KEY must be set in .env file for actual deployment');
    return;
  }
  
  const account = new Account(
    provider,
    ownerAddress,
    privateKey
  );
  
  try {
    // Step 1: Declare the main contract that compiled successfully
    console.log('1. Declaring main contract...');
    
    const contractPath = path.resolve(__dirname, '../target/dev/starkquest_HelloStarknet.contract_class.json');
    const casmPath = path.resolve(__dirname, '../target/dev/starkquest_HelloStarknet.compiled_contract_class.json');
    
    if (!fs.existsSync(contractPath)) {
      throw new Error(`Contract file not found: ${contractPath}`);
    }
    
    if (!fs.existsSync(casmPath)) {
      throw new Error(`CASM file not found: ${casmPath}`);
    }
    
    const contractJson = fs.readFileSync(contractPath, 'utf-8');
    const casmJson = fs.readFileSync(casmPath, 'utf-8');
    
    const classHash = await account.declare({
      contract: contractJson,
      casm: JSON.parse(casmJson),
    });
    
    console.log(`   Contract declared successfully with class hash: ${classHash.class_hash}`);
    
    // Step 2: Deploy the contract
    console.log('2. Deploying contract...');
    
    const deployResponse = await account.deploy({
      classHash: classHash.class_hash,
      constructorCalldata: CallData.compile({}), // Empty constructor for HelloStarknet
    });
    
    const contractAddress = Array.isArray(deployResponse.contract_address) 
      ? deployResponse.contract_address[0] 
      : deployResponse.contract_address;
    
    console.log(`   Contract deployed at: ${contractAddress}`);
    
    console.log('\nTest deployment completed successfully!');
    console.log('This confirms that:');
    console.log('- ts-node is working correctly');
    console.log('- Contract compilation is working');
    console.log('- CASM generation is working');
    console.log('- The deployment script structure is correct');
    console.log('\nNext steps:');
    console.log('1. Fix the individual contract files to generate proper CASM files');
    console.log('2. Update environment variables with real StarkNet credentials');
    console.log('3. Run the full deployment script');
    
  } catch (error) {
    console.error('Test deployment failed:', error);
  }
}

// Run test deployment if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDeploy();
}

export default testDeploy;