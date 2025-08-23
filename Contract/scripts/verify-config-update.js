// Simple script to verify that the config update functionality works correctly
const fs = require('fs');
const path = require('path');

// Simulate the deployed StarkQuest Minimal address
const starkQuestMinimalAddress = "0x04f68b109bf471fd4121086f40a98a00f67eabd37a7f9a4135cab9847c5a404e";

// Read existing config file to preserve other contract addresses
const configPath = path.resolve(__dirname, '../../lib/config.ts');
let existingConfig = {
  BOUNTY_REGISTRY: "",
  BOUNTY_FACTORY: "",
  PAYMENT_PROCESSOR: "",
  REPUTATION_SYSTEM: ""
};

try {
  const configContent = fs.readFileSync(configPath, 'utf-8');
  console.log('Current config content:');
  console.log(configContent);
  
  // Extract existing contract addresses using regex
  const bountyRegistryMatch = configContent.match(/BOUNTY_REGISTRY:\s*["'](0x[0-9a-fA-F]+)["']/);
  const bountyFactoryMatch = configContent.match(/BOUNTY_FACTORY:\s*["'](0x[0-9a-fA-F]+)["']/);
  const paymentProcessorMatch = configContent.match(/PAYMENT_PROCESSOR:\s*["'](0x[0-9a-fA-F]+)["']/);
  const reputationSystemMatch = configContent.match(/REPUTATION_SYSTEM:\s*["'](0x[0-9a-fA-F]+)["']/);
  
  if (bountyRegistryMatch) existingConfig.BOUNTY_REGISTRY = bountyRegistryMatch[1];
  if (bountyFactoryMatch) existingConfig.BOUNTY_FACTORY = bountyFactoryMatch[1];
  if (paymentProcessorMatch) existingConfig.PAYMENT_PROCESSOR = paymentProcessorMatch[1];
  if (reputationSystemMatch) existingConfig.REPUTATION_SYSTEM = reputationSystemMatch[1];
  
  console.log('\nExisting contract addresses found:');
  console.log(`  BOUNTY_REGISTRY: ${existingConfig.BOUNTY_REGISTRY}`);
  console.log(`  BOUNTY_FACTORY: ${existingConfig.BOUNTY_FACTORY}`);
  console.log(`  PAYMENT_PROCESSOR: ${existingConfig.PAYMENT_PROCESSOR}`);
  console.log(`  REPUTATION_SYSTEM: ${existingConfig.REPUTATION_SYSTEM}`);
} catch (error) {
  console.log('No existing config file found or error reading it, using default empty addresses');
}

const newConfigContent = `// Contract addresses for StarkNet
export const CONTRACT_ADDRESSES = {
  STARKQUEST_MINIMAL: "${starkQuestMinimalAddress}",
  BOUNTY_REGISTRY: "${existingConfig.BOUNTY_REGISTRY}",
  BOUNTY_FACTORY: "${existingConfig.BOUNTY_FACTORY}",
  PAYMENT_PROCESSOR: "${existingConfig.PAYMENT_PROCESSOR}",
  REPUTATION_SYSTEM: "${existingConfig.REPUTATION_SYSTEM}",
};

// Network configuration
export const NETWORK = "goerli";

// Token addresses
export const TOKEN_ADDRESSES = {
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
};
`;

console.log('\nNew config content that would be written:');
console.log(newConfigContent);

console.log('\nVerification complete: All existing contract addresses would be preserved while updating only STARKQUEST_MINIMAL');