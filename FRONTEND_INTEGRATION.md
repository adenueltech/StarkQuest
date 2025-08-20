# StarkQuest Frontend Integration Guide

This guide provides instructions for integrating the StarkQuest smart contracts with the frontend application.

## Prerequisites

1. Ensure smart contracts are deployed (see DEPLOYMENT_GUIDE.md)
2. Update contract addresses in `lib/config.ts`
3. Install required dependencies:

```bash
npm install starknet
```

## Contract Integration

### 1. Update Configuration

Update `lib/config.ts` with actual deployed contract addresses:

```typescript
// lib/config.ts
export const CONTRACT_ADDRESSES = {
  BOUNTY_REGISTRY: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  BOUNTY_FACTORY: "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
  PAYMENT_PROCESSOR: "0x23456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
  REPUTATION_SYSTEM: "0x3456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012",
  STARK_EARN: "0x456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123"
};

export const NETWORK = "goerli"; // or "mainnet" for production

export const TOKEN_ADDRESSES = {
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
};
```

### 2. Update ABI Files

Ensure ABI files in `lib/abis/` match the deployed contracts. Each ABI should include all public functions and events.

Example BountyFactory ABI (`lib/abis/BountyFactory.json`):

```json
[
  {
    "name": "create_bounty",
    "type": "function",
    "inputs": [
      {
        "name": "title",
        "type": "core::felt252"
      },
      {
        "name": "description",
        "type": "core::felt252"
      },
      {
        "name": "reward_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "deadline",
        "type": "core::integer::u64"
      },
      {
        "name": "token_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [
      {
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "state_mutability": "external"
  },
  {
    "name": "BountyCreated",
    "type": "event",
    "kind": "struct",
    "members": [
      {
        "name": "bounty_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "creator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "bounty_id",
        "type": "core::integer::u64"
      }
    ]
  }
]
```

### 3. Update StarkNet Service

Update `lib/services/starknet.ts` with proper contract integration:

```typescript
// lib/services/starknet.ts
import { Contract, Account, RpcProvider, cairo, CallData } from 'starknet';
import { CONTRACT_ADDRESSES } from '../config';
import bountyRegistryAbi from '../abis/BountyRegistry.json';
import bountyFactoryAbi from '../abis/BountyFactory.json';
import bountyAbi from '../abis/Bounty.json';
import paymentProcessorAbi from '../abis/PaymentProcessor.json';
import reputationSystemAbi from '../abis/ReputationSystem.json';
import starkEarnAbi from '../abis/StarkEarn.json';

// Initialize provider
const provider = new RpcProvider({
  nodeUrl: 'https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID'
});

// Contract instances
let bountyRegistry: Contract | null = null;
let bountyFactory: Contract | null = null;
let paymentProcessor: Contract | null = null;
let reputationSystem: Contract | null = null;
let starkEarn: Contract | null = null;

// Initialize contracts
export const initializeContracts = () => {
  bountyRegistry = new Contract(
    bountyRegistryAbi,
    CONTRACT_ADDRESSES.BOUNTY_REGISTRY,
    provider
  );
  
  bountyFactory = new Contract(
    bountyFactoryAbi,
    CONTRACT_ADDRESSES.BOUNTY_FACTORY,
    provider
  );
  
  paymentProcessor = new Contract(
    paymentProcessorAbi,
    CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
    provider
  );
  
  reputationSystem = new Contract(
    reputationSystemAbi,
    CONTRACT_ADDRESSES.REPUTATION_SYSTEM,
    provider
  );
  
  starkEarn = new Contract(
    starkEarnAbi,
    CONTRACT_ADDRESSES.STARK_EARN,
    provider
  );
};

// Wallet connection
let account: Account | null = null;

export const connectWallet = async (): Promise<string> => {
  if (typeof window === 'undefined') {
    throw new Error('Wallet connection is only available in browser');
  }
  
  // Try to use injected StarkNet provider (ArgentX, Braavos, etc.)
  const starknet = (window as any).starknet;
  if (!starknet) {
    throw new Error('StarkNet wallet not found. Please install ArgentX or Braavos extension.');
  }
  
  try {
    // Enable the wallet
    await starknet.enable({ showModal: true });
    
    // Get the account
    account = starknet.account;
    
    // Return the account address
    return account.address;
  } catch (error) {
    throw new Error(`Failed to connect wallet: ${(error as Error).message}`);
  }
};

// Get account
export const getAccount = () => account;

// Create bounty
export const createBounty = async (
  title: string,
  description: string,
  rewardAmount: string,
  deadline: number,
  tokenAddress: string
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!starkEarn) {
    initializeContracts();
  }
  
  try {
    // Convert string to felt
    const titleFelt = cairo.felt(title);
    const descriptionFelt = cairo.felt(description);
    const tokenAddressFelt = cairo.felt(tokenAddress);
    
    // Convert reward amount to uint256
    const rewardAmountUint256 = cairo.uint256(rewardAmount);
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.STARK_EARN,
      entrypoint: 'create_bounty',
      calldata: CallData.compile({
        title: titleFelt,
        description: descriptionFelt,
        reward_amount: rewardAmountUint256,
        deadline: deadline,
        token_address: tokenAddressFelt
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to create bounty: ${(error as Error).message}`);
  }
};

// Submit application
export const submitApplication = async (
  bountyAddress: string,
  proposal: string
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  try {
    // Create contract instance for the specific bounty
    const bountyContract = new Contract(
      bountyAbi,
      bountyAddress,
      provider
    );
    
    // Convert proposal to felt
    const proposalFelt = cairo.felt(proposal);
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: bountyAddress,
      entrypoint: 'submit_application',
      calldata: CallData.compile({
        proposal: proposalFelt
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to submit application: ${(error as Error).message}`);
  }
};

// Accept application
export const acceptApplication = async (
  bountyAddress: string,
  applicationId: number
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  try {
    // Create contract instance for the specific bounty
    const bountyContract = new Contract(
      bountyAbi,
      bountyAddress,
      provider
    );
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: bountyAddress,
      entrypoint: 'accept_application',
      calldata: CallData.compile({
        application_id: applicationId
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to accept application: ${(error as Error).message}`);
  }
};

// Submit work
export const submitWork = async (
  bountyAddress: string,
  content: string
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  try {
    // Create contract instance for the specific bounty
    const bountyContract = new Contract(
      bountyAbi,
      bountyAddress,
      provider
    );
    
    // Convert content to felt
    const contentFelt = cairo.felt(content);
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: bountyAddress,
      entrypoint: 'submit_work',
      calldata: CallData.compile({
        content: contentFelt
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to submit work: ${(error as Error).message}`);
  }
};

// Approve submission
export const approveSubmission = async (
  bountyAddress: string,
  submissionId: number
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  try {
    // Create contract instance for the specific bounty
    const bountyContract = new Contract(
      bountyAbi,
      bountyAddress,
      provider
    );
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: bountyAddress,
      entrypoint: 'approve_submission',
      calldata: CallData.compile({
        submission_id: submissionId
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to approve submission: ${(error as Error).message}`);
  }
};

// Cancel bounty
export const cancelBounty = async (
  bountyAddress: string,
  reason: string
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  try {
    // Create contract instance for the specific bounty
    const bountyContract = new Contract(
      bountyAbi,
      bountyAddress,
      provider
    );
    
    // Convert reason to felt
    const reasonFelt = cairo.felt(reason);
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: bountyAddress,
      entrypoint: 'cancel_bounty',
      calldata: CallData.compile({
        reason: reasonFelt
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to cancel bounty: ${(error as Error).message}`);
  }
};

// Get bounty details
export const getBountyDetails = async (bountyAddress: string) => {
  if (!bountyRegistry) {
    initializeContracts();
  }
  
  try {
    // Create contract instance for the specific bounty
    const bountyContract = new Contract(
      bountyAbi,
      bountyAddress,
      provider
    );
    
    const details = await bountyContract.get_bounty_details();
    return details;
  } catch (error) {
    throw new Error(`Failed to get bounty details: ${(error as Error).message}`);
  }
};

// Get user reputation
export const getUserReputation = async (userAddress: string) => {
  if (!reputationSystem) {
    initializeContracts();
  }
  
  try {
    const reputation = await reputationSystem?.get_user_reputation(userAddress);
    return reputation;
  } catch (error) {
    throw new Error(`Failed to get user reputation: ${(error as Error).message}`);
  }
};

// Listen to events
export const listenToEvents = (callback: (event: any) => void) => {
  if (!bountyFactory) {
    initializeContracts();
  }
  
  // Set up event listener for BountyCreated events
  provider.getEvents({
    address: CONTRACT_ADDRESSES.BOUNTY_FACTORY,
    keys: [['BountyCreated']],
    from_block: 'latest',
    to_block: 'latest'
  }).then((events) => {
    events.events.forEach((event) => {
      callback(event);
    });
  });
};
```

### 4. Update Frontend Components

Update frontend components to use the real StarkNet service functions:

Example update for `app/post-bounty/page.tsx`:

```typescript
// Add this to your imports
import { createBounty } from "@/lib/services/starknet";
import { CONTRACT_ADDRESSES, TOKEN_ADDRESSES } from "@/lib/config";

// In your component, update the handleSubmit function:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Connect wallet if not already connected
    const walletAddress = await connectWallet();
    
    // Get form values
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const description = (document.getElementById("description") as HTMLTextAreaElement).value;
    const reward = (document.getElementById("reward") as HTMLInputElement).value;
    const currency = (document.getElementById("currency") as HTMLSelectElement).value;
    const deadline = (document.getElementById("deadline") as HTMLInputElement).value;
    
    // Convert deadline to timestamp
    const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
    
    // Get token address
    const tokenAddress = TOKEN_ADDRESSES[currency.toUpperCase() as keyof typeof TOKEN_ADDRESSES];
    
    // Create bounty
    const transactionHash = await createBounty(
      title,
      description,
      reward,
      deadlineTimestamp,
      tokenAddress
    );
    
    console.log("Bounty created with transaction hash:", transactionHash);
    // Redirect to success page or show success message
  } catch (error) {
    console.error("Error creating bounty:", error);
    // Show error message to user
  }
};
```

## Testing Integration

### 1. Wallet Connection Test

Test wallet connection in browser console:

```javascript
import { connectWallet, getAccount } from "@/lib/services/starknet";

// Test connection
connectWallet().then((address) => {
  console.log("Connected wallet:", address);
  const account = getAccount();
  console.log("Account object:", account);
});
```

### 2. Contract Interaction Test

Test contract interaction:

```javascript
import { createBounty, getBountyDetails } from "@/lib/services/starknet";

// Test creating a bounty
createBounty(
  "Test Bounty",
  "This is a test bounty",
  "1000000000000000000", // 1 ETH in wei
  Math.floor(Date.now() / 1000) + 86400 * 7, // 1 week from now
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7" // ETH address
).then((txHash) => {
  console.log("Transaction hash:", txHash);
});
```

## Event Monitoring

Set up event monitoring for real-time updates:

```typescript
// In a useEffect hook or component initialization
useEffect(() => {
  const handleBountyCreated = (event: any) => {
    console.log("New bounty created:", event);
    // Update UI with new bounty
  };
  
  listenToEvents(handleBountyCreated);
}, []);
```

## Error Handling

Implement proper error handling throughout the application:

```typescript
try {
  const result = await createBounty(/* parameters */);
  // Handle success
} catch (error) {
  if (error.message.includes("Wallet not connected")) {
    // Prompt user to connect wallet
  } else if (error.message.includes("Insufficient funds")) {
    // Show insufficient funds message
  } else {
    // Show generic error message
    console.error("Transaction failed:", error);
  }
}
```

## Security Considerations

1. Always validate user input before sending to contracts
2. Use proper error handling for all contract interactions
3. Implement transaction status monitoring
4. Store sensitive configuration in environment variables
5. Use HTTPS for all API endpoints

## Troubleshooting

### Common Issues

1. **Wallet connection fails**: Ensure StarkNet wallet extension is installed and unlocked
2. **Contract calls fail**: Verify contract addresses and ABI files are correct
3. **Transaction reverts**: Check contract error messages for specific reasons
4. **Events not firing**: Ensure event listener is properly set up and filters are correct

### Debugging Tips

1. Use StarkScan to verify transaction status
2. Check browser console for detailed error messages
3. Use `starknet get_transaction_receipt` to get detailed transaction information
4. Verify contract state using `starknet call` commands

## Next Steps

1. Implement comprehensive error handling
2. Add transaction status monitoring
3. Set up notifications for user actions
4. Implement search and filtering functionality
5. Add analytics for platform usage tracking