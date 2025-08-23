import { Contract, Account, RpcProvider, cairo, CallData } from 'starknet';
import { CONTRACT_ADDRESSES } from '../config';
import bountyRegistryAbi from '../abis/BountyRegistry.json';
import bountyFactoryAbi from '../abis/BountyFactory.json';
import bountyAbi from '../abis/Bounty.json';
import paymentProcessorAbi from '../abis/PaymentProcessor.json';
import reputationSystemAbi from '../abis/ReputationSystem.json';

// Initialize provider
const provider = new RpcProvider({
  nodeUrl: 'https://rpc.starknet-testnet.lava.build'
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
  rewardAmount: string,
  deadline: number,
  tokenAddress: string
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
    const tokenAddressFelt = cairo.felt(tokenAddress);
    
    // Convert reward amount to uint256
    const rewardAmountUint256 = cairo.uint256(rewardAmount);
    const deadlineU64 = cairo.uint256(deadline.toString());
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.BOUNTY_FACTORY,
      entrypoint: 'create_bounty',
      calldata: CallData.compile({
        title: titleFelt,
        description: descriptionFelt,
        reward_amount: rewardAmountUint256,
        deadline: deadlineU64,
        token_address: tokenAddressFelt
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to create bounty: ${(error as Error).message}`);
  }
};

// Submit application
export const submitApplication = async (bountyAddress: string) => {
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
      entrypoint: 'submit_application',
      calldata: CallData.compile({})
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

// Get application
export const getApplication = async (bountyAddress: string, applicationId: number) => {
  try {
    // Create contract instance for the specific bounty
    const bountyContract = new Contract(
      bountyAbi,
      bountyAddress,
      provider
    );
    
    const application = await bountyContract.get_application(applicationId);
    return application;
  } catch (error) {
    throw new Error(`Failed to get application: ${(error as Error).message}`);
  }
};

// Get submission
export const getSubmission = async (bountyAddress: string, submissionId: number) => {
  try {
    // Create contract instance for the specific bounty
    const bountyContract = new Contract(
      bountyAbi,
      bountyAddress,
      provider
    );
    
    const submission = await bountyContract.get_submission(submissionId);
    return submission;
  } catch (error) {
    throw new Error(`Failed to get submission: ${(error as Error).message}`);
  }
};

// Deposit escrow
export const depositEscrow = async (
  bountyAddress: string,
  amount: string
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!paymentProcessor) {
    initializeContracts();
  }
  
  try {
    // Convert amount to uint256
    const amountUint256 = cairo.uint256(amount);
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
      entrypoint: 'deposit_escrow',
      calldata: CallData.compile({
        bounty_address: bountyAddress,
        amount: amountUint256
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to deposit escrow: ${(error as Error).message}`);
  }
};

// Process payment
export const processPayment = async (
  bountyAddress: string,
  hunterAddress: string,
  amount: string
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!paymentProcessor) {
    initializeContracts();
  }
  
  try {
    // Convert amount to uint256
    const amountUint256 = cairo.uint256(amount);
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
      entrypoint: 'process_payment',
      calldata: CallData.compile({
        bounty_address: bountyAddress,
        hunter: hunterAddress,
        amount: amountUint256
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to process payment: ${(error as Error).message}`);
  }
};

// Process refund
export const processRefund = async (
  bountyAddress: string,
  creatorAddress: string,
  amount: string
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!paymentProcessor) {
    initializeContracts();
  }
  
  try {
    // Convert amount to uint256
    const amountUint256 = cairo.uint256(amount);
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
      entrypoint: 'process_refund',
      calldata: CallData.compile({
        bounty_address: bountyAddress,
        creator: creatorAddress,
        amount: amountUint256
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to process refund: ${(error as Error).message}`);
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

// Register user
export const registerUser = async (
  userAddress: string,
  initialScore: number
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!reputationSystem) {
    initializeContracts();
  }
  
  try {
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.REPUTATION_SYSTEM,
      entrypoint: 'register_user',
      calldata: CallData.compile({
        user: userAddress,
        initial_score: initialScore
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to register user: ${(error as Error).message}`);
  }
};

// Update reputation
export const updateReputation = async (
  userAddress: string,
  isCreator: boolean,
  isCompleted: boolean,
  qualityScore: number
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!reputationSystem) {
    initializeContracts();
  }
  
  try {
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.REPUTATION_SYSTEM,
      entrypoint: 'update_reputation',
      calldata: CallData.compile({
        user: userAddress,
        is_creator: isCreator,
        is_completed: isCompleted,
        quality_score: qualityScore
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to update reputation: ${(error as Error).message}`);
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