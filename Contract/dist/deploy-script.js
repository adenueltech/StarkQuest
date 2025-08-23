// Deployment script for StarkQuest contracts
// This script handles the deployment of all contracts in the correct order
import { Account, RpcProvider, CallData } from 'starknet';
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
    const account = new Account(provider, ownerAddress, privateKey);
    console.log("Account set up successfully");
    // Deployment parameters
    const CONFIG = {
        ownerAddress: ownerAddress,
    };
    console.log("Configuration set:", CONFIG);
    try {
        // Step 1: Declare contracts
        console.log('1. Declaring contracts...');
        // Helper function to declare contract with CASM if available
        const declareContract = async (contractName) => {
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
            }
            else {
                // Try without CASM (might work for simple contracts)
                console.log(`   Warning: No CASM file found for ${contractName}, trying without it...`);
                return await account.declare({
                    contract: contractJson,
                });
            }
        };
        // Declare starkquest_minimal contract
        console.log('Declaring starkquest_minimal contract...');
        const starkQuestMinimalClassHash = await declareContract('starkquest_minimal');
        console.log('StarkQuest minimal contract declared:', starkQuestMinimalClassHash.class_hash);
        console.log('   Contracts declared successfully');
        // Step 2: Deploy contracts
        console.log('2. Deploying contracts...');
        // Deploy StarkQuest Minimal Contract
        console.log('Deploying StarkQuest Minimal...');
        const starkQuestMinimalResponse = await account.deploy({
            classHash: starkQuestMinimalClassHash.class_hash,
            constructorCalldata: CallData.compile({}),
        });
        // Handle potential array return type with type assertion
        const starkQuestMinimalAddress = (Array.isArray(starkQuestMinimalResponse.contract_address)
            ? starkQuestMinimalResponse.contract_address[0]
            : starkQuestMinimalResponse.contract_address);
        console.log(`   StarkQuest Minimal deployed at: ${starkQuestMinimalAddress}`);
        // Step 3: Update frontend configuration
        console.log('3. Updating frontend configuration...');
        const configContent = `// Contract addresses for StarkNet
export const CONTRACT_ADDRESSES = {
  STARKQUEST_MINIMAL: "${starkQuestMinimalAddress}",
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
        fs.writeFileSync(path.resolve(__dirname, '../../lib/config.ts'), configContent);
        console.log('Frontend configuration updated');
        console.log('\nDeployment completed successfully!');
        console.log('Deployed contract addresses:');
        console.log(`  StarkQuest Minimal: ${starkQuestMinimalAddress}`);
    }
    catch (error) {
        console.error('Deployment failed:', error);
    }
}
// Always run deployment when this script is executed directly
console.log("Running deployment...");
deploy();
export default deploy;
