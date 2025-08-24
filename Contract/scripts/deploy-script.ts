// Robust deployment script for StarkEarn contracts with connection testing
import { Account, RpcProvider, CallData } from "starknet";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
console.log("Environment variables loaded:");
console.log(
  "STARKNET_NODE_URL:",
  process.env.STARKNET_NODE_URL ? "SET" : "NOT SET"
);
console.log("OWNER_ADDRESS:", process.env.OWNER_ADDRESS ? "SET" : "NOT SET");
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY ? "SET" : "NOT SET");

// Working RPC endpoints as fallbacks
const FALLBACK_ENDPOINTS = [
  "https://starknet-sepolia.public.blastapi.io",
  "https://free-rpc.nethermind.io/sepolia-juno",
  "https://starknet-sepolia.infura.io/v3/YOUR_INFURA_KEY",
  "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/YOUR_ALCHEMY_KEY",
];

async function testProvider(nodeUrl: string): Promise<RpcProvider | null> {
  try {
    console.log(`Testing endpoint: ${nodeUrl}`);
    const provider = new RpcProvider({ nodeUrl });
    const chainId = await Promise.race([
      provider.getChainId(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout (5s)")), 5000)
      ),
    ]);
    console.log(`✅ Connection successful! Chain ID: ${chainId}`);
    return provider;
  } catch (error: any) {
    console.log(`❌ Connection failed: ${error.message}`);
    return null;
  }
}

async function findWorkingProvider(): Promise<RpcProvider> {
  console.log("Finding working RPC provider...");
  if (process.env.STARKNET_NODE_URL) {
    const provider = await testProvider(process.env.STARKNET_NODE_URL);
    if (provider) return provider;
  }
  for (const endpoint of FALLBACK_ENDPOINTS) {
    const provider = await testProvider(endpoint);
    if (provider) return provider;
  }
  throw new Error(
    "No working RPC endpoint found. Please check your internet connection or try a different endpoint."
  );
}

async function deploy() {
  console.log("Starting StarkEarn contract deployment...");

  try {
    const provider = await findWorkingProvider();

    const ownerAddress = process.env.OWNER_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;

    if (!ownerAddress || !privateKey) {
      console.error(
        "OWNER_ADDRESS and PRIVATE_KEY must be set in environment variables"
      );
      return;
    }

    console.log("Environment variables validated");

    // Step 3: Setup account with proper key pair
    console.log("Setting up account...");
    // In starknet.js v7+, we need to handle Argent wallets differently
    // First, let's try to get the account class hash for Argent wallets
    let account: Account;
    try {
      // Try to get the class hash of the account to determine if it's an Argent wallet
      const classHash = await provider.getClassHashAt(ownerAddress);
      console.log(`Account class hash: ${classHash}`);

      // Create account - for Argent wallets, we still use the same constructor
      // but we need to ensure the private key matches the public key of the account
      account = new Account(provider, ownerAddress, privateKey);
    } catch (error: any) {
      console.log(
        "Could not get account class hash, creating account with provided details"
      );
      account = new Account(provider, ownerAddress, privateKey);
    }

    try {
      console.log("Validating account setup...");
      const nonce = await account.getNonce();
      console.log(`✅ Account validation successful. Nonce: ${nonce}`);
    } catch (error: any) {
      if (
        error.message.includes("argent invalid owner sig") ||
        error.message.includes("invalid signature")
      ) {
        console.error(
          "❌ Account validation failed - Private key/address mismatch"
        );
        console.log(
          "🔧 Ensure PRIVATE_KEY matches OWNER_ADDRESS from ArgentX (Sepolia testnet)"
        );
        return;
      }
      throw error;
    }

    console.log("Account set up successfully");

    // Step 4: Declare contract helper
    const declareContract = async (contractName: string) => {
      console.log(`Declaring contract: ${contractName}`);
      const patterns = [
        `${contractName}_HelloStarknet`,
        `${contractName}_${contractName}`,
        contractName,
        `StarkEarn_minimal_StarkEarn_minimal`,
      ];

      let contractPath = "";
      let casmPath = "";
      let found = false;

      for (const pattern of patterns) {
        contractPath = path.resolve(
          __dirname,
          `../target/dev/${pattern}.contract_class.json`
        );
        casmPath = path.resolve(
          __dirname,
          `../target/dev/${pattern}.compiled_contract_class.json`
        );
        if (fs.existsSync(contractPath)) {
          found = true;
          break;
        }
      }

      if (!found)
        throw new Error(`Contract file not found for ${contractName}`);

      const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf-8"));

      if (fs.existsSync(casmPath)) {
        const casmJson = JSON.parse(fs.readFileSync(casmPath, "utf-8"));
        try {
          return await account.declare({
            contract: contractJson,
            casm: casmJson,
          });
        } catch (error: any) {
          if (error.message.includes("already declared")) {
            const match = error.message.match(
              /Class with hash (0x[0-9a-fA-F]+)/
            );
            if (match && match[1])
              return { class_hash: match[1], transaction_hash: null };
          }
          throw error;
        }
      } else {
        try {
          return await account.declare({ contract: contractJson });
        } catch (error: any) {
          if (error.message.includes("already declared")) {
            const match = error.message.match(
              /Class with hash (0x[0-9a-fA-F]+)/
            );
            if (match && match[1])
              return { class_hash: match[1], transaction_hash: null };
          }
          throw error;
        }
      }
    };

    // Declare and deploy
    const declareResult = await declareContract("StarkEarn_minimal");
    console.log(
      "StarkEarn minimal contract declared with transaction hash:",
      declareResult.transaction_hash
    );
    console.log(
      "StarkEarn minimal contract class hash:",
      declareResult.class_hash
    );

    if (declareResult.transaction_hash) {
      console.log("Waiting for declaration transaction confirmation...");
      await provider.waitForTransaction(declareResult.transaction_hash);
      console.log("✅ Declaration confirmed!");
    }

    console.log("Deploying StarkEarn Minimal...");
    const deployResponse = await account.deploy({
      classHash: declareResult.class_hash,
      constructorCalldata: CallData.compile({}),
    });

    const deployedAddress = Array.isArray(deployResponse.contract_address)
      ? deployResponse.contract_address[0]
      : deployResponse.contract_address;

    console.log(`✅ StarkEarn Minimal deployed at: ${deployedAddress}`);

    // Update frontend config
    const configPath = path.resolve(__dirname, "../../lib/config.ts");
    const newConfig = `// Contract addresses for StarkNet
export const CONTRACT_ADDRESSES = {
  StarkEarn_MINIMAL: "${deployedAddress}",
  BOUNTY_REGISTRY: "${deployedAddress}",
  BOUNTY_FACTORY: "${deployedAddress}",
  PAYMENT_PROCESSOR: "${deployedAddress}",
  REPUTATION_SYSTEM: "${deployedAddress}",
};

export const NETWORK = "goerli";

export const TOKEN_ADDRESSES = {
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
};
`;
    fs.writeFileSync(configPath, newConfig);
    console.log("✅ Frontend configuration updated");
    console.log("🎉 Deployment completed successfully!");
  } catch (error) {
    console.error("💥 Deployment failed:", error);
  }
}

console.log("Running robust deployment...");
deploy();
