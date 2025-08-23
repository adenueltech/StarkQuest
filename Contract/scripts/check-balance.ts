// Script to check account on StarkNet Goerli testnet
import { Account, RpcProvider } from 'starknet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkAccount() {
  console.log("Checking account...");
  
  // Configuration
  const provider = new RpcProvider({
    nodeUrl: process.env.STARKNET_NODE_URL || 'https://starknet-goerli.public.blastapi.io'
  });
  
  const ownerAddress = process.env.OWNER_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!ownerAddress || !privateKey) {
    console.error('OWNER_ADDRESS and PRIVATE_KEY must be set in environment variables');
    return;
  }
  
  const account = new Account(
    provider,
    ownerAddress,
    privateKey
  );
  
  try {
    // Try to get the nonce
    console.log("Checking account nonce...");
    const nonce = await account.getNonce();
    console.log(`Account nonce: ${nonce}`);
    
    console.log("Account is properly configured and accessible!");
  } catch (error) {
    console.error('Error checking account:', error);
  }
}

checkAccount();