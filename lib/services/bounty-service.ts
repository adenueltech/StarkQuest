import { Contract, Account, RpcProvider, cairo, CallData } from 'starknet';
import { CONTRACT_ADDRESSES } from '../config';
import bountyRegistryAbi from '../abis/BountyRegistry.json';
import bountyFactoryAbi from '../abis/BountyFactory.json';
import bountyAbi from '../abis/Bounty.json';
import paymentProcessorAbi from '../abis/PaymentProcessor.json';
import reputationSystemAbi from '../abis/ReputationSystem.json';

// Initialize provider
const provider = new RpcProvider({
  nodeUrl: 'https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID'
});

// Contract instances
let bountyRegistry: Contract | null = null;
let bountyFactory: Contract | null = null;
let paymentProcessor: Contract | null = null;
let reputationSystem: Contract | null = null;

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
    if (account) {
      return account.address;
    } else {
      throw new Error('Failed to get account from wallet');
    }
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
  category: string,
  rewardToken: string,
  rewardAmount: string,
  deadline: number
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!bountyFactory) {
    initializeContracts();
  }
  
  try {
    // Convert string to felt
    const titleFelt = cairo.felt(title);
    const descriptionFelt = cairo.felt(description);
    const categoryFelt = cairo.felt(category);
    const rewardTokenFelt = cairo.felt(rewardToken);
    
    // Convert reward amount to uint256
    const rewardAmountUint256 = cairo.uint256(rewardAmount);
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.BOUNTY_FACTORY,
      entrypoint: 'create_bounty',
      calldata: CallData.compile({
        title: titleFelt,
        description: descriptionFelt,
        category: categoryFelt,
        reward_token: rewardTokenFelt,
        reward_amount: rewardAmountUint256,
        deadline: deadline
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

// Review application
export const reviewApplication = async (
  bountyAddress: string,
  applicationIndex: number,
  status: number // 0 = Pending, 1 = Accepted, 2 = Rejected, 3 = Withdrawn
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
      entrypoint: 'review_application',
      calldata: CallData.compile({
        application_index: applicationIndex,
        status: status
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to review application: ${(error as Error).message}`);
  }
};

// Complete bounty
export const completeBounty = async (
  bountyAddress: string,
  submission: string
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
    
    // Convert submission to felt
    const submissionFelt = cairo.felt(submission);
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: bountyAddress,
      entrypoint: 'complete_bounty',
      calldata: CallData.compile({
        submission: submissionFelt
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to complete bounty: ${(error as Error).message}`);
  }
};

// Distribute payment
export const distributePayment = async (
  bountyAddress: string,
  hunterAddress: string
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!paymentProcessor) {
    initializeContracts();
  }
  
  try {
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
      entrypoint: 'distribute_payment',
      calldata: CallData.compile({
        hunter: hunterAddress
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to distribute payment: ${(error as Error).message}`);
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

// Get bounty details
export const getBountyDetails = async (bountyAddress: string) => {
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

// Get all bounties
export const getAllBounties = async () => {
  if (!bountyRegistry) {
    initializeContracts();
  }
  
  try {
    // Get bounty count
    const count = await bountyRegistry?.get_bounty_count();
    const bountyCount = parseInt(count.toString());
    
    // Get all bounty addresses
    const bountyAddresses = [];
    for (let i = 1; i <= bountyCount; i++) {
      const address = await bountyRegistry?.get_bounty_address(i);
      bountyAddresses.push(address);
    }
    
    return bountyAddresses;
  } catch (error) {
    throw new Error(`Failed to get bounties: ${(error as Error).message}`);
  }
};