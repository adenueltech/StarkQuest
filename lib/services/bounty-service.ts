import { Contract, Account, RpcProvider, cairo, CallData } from 'starknet';
import { CONTRACT_ADDRESSES } from '../config';
import starkQuestMinimalAbi from '../abis/StarkQuestMinimal.json';

// Initialize provider
const provider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_STARKNET_NODE_URL || 'https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID'
});

// Contract instances
let starkQuestMinimal: Contract | null = null;

// Initialize contracts
export const initializeContracts = () => {
  starkQuestMinimal = new Contract(
    starkQuestMinimalAbi,
    CONTRACT_ADDRESSES.STARKQUEST_MINIMAL,
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
  
  if (!starkQuestMinimal) {
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
      contractAddress: CONTRACT_ADDRESSES.STARKQUEST_MINIMAL,
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
export const submitApplication = async (bountyId: number) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!starkQuestMinimal) {
    initializeContracts();
  }
  
  try {
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.STARKQUEST_MINIMAL,
      entrypoint: 'submit_application',
      calldata: CallData.compile({
        bounty_id: bountyId
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to submit application: ${(error as Error).message}`);
  }
};

// Accept application
export const acceptApplication = async (
  bountyId: number,
  applicationId: number
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!starkQuestMinimal) {
    initializeContracts();
  }
  
  try {
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.STARKQUEST_MINIMAL,
      entrypoint: 'accept_application',
      calldata: CallData.compile({
        bounty_id: bountyId,
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
  bountyId: number,
  content: string
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!starkQuestMinimal) {
    initializeContracts();
  }
  
  try {
    // Convert content to felt
    const contentFelt = cairo.felt(content);
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.STARKQUEST_MINIMAL,
      entrypoint: 'submit_work',
      calldata: CallData.compile({
        bounty_id: bountyId,
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
  bountyId: number,
  submissionId: number
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!starkQuestMinimal) {
    initializeContracts();
  }
  
  try {
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.STARKQUEST_MINIMAL,
      entrypoint: 'approve_submission',
      calldata: CallData.compile({
        bounty_id: bountyId,
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
  bountyId: number,
  reason: string
) => {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  
  if (!starkQuestMinimal) {
    initializeContracts();
  }
  
  try {
    // Convert reason to felt
    const reasonFelt = cairo.felt(reason);
    
    // Call the contract
    const { transaction_hash } = await account.execute({
      contractAddress: CONTRACT_ADDRESSES.STARKQUEST_MINIMAL,
      entrypoint: 'cancel_bounty',
      calldata: CallData.compile({
        bounty_id: bountyId,
        reason: reasonFelt
      })
    });
    
    return transaction_hash;
  } catch (error) {
    throw new Error(`Failed to cancel bounty: ${(error as Error).message}`);
  }
};

// Get bounty details
export const getBountyById = async (bountyId: number) => {
  try {
    if (!starkQuestMinimal) {
      initializeContracts();
    }
    
    const details = await starkQuestMinimal?.get_bounty(bountyId);
    return details;
  } catch (error) {
    throw new Error(`Failed to get bounty details: ${(error as Error).message}`);
  }
};

// Get application
export const getApplication = async (bountyId: number, applicationId: number) => {
  try {
    if (!starkQuestMinimal) {
      initializeContracts();
    }
    
    const application = await starkQuestMinimal?.get_application(bountyId, applicationId);
    return application;
  } catch (error) {
    throw new Error(`Failed to get application: ${(error as Error).message}`);
  }
};

// Get submission
export const getSubmission = async (bountyId: number, submissionId: number) => {
  try {
    if (!starkQuestMinimal) {
      initializeContracts();
    }
    
    const submission = await starkQuestMinimal?.get_submission(bountyId, submissionId);
    return submission;
  } catch (error) {
    throw new Error(`Failed to get submission: ${(error as Error).message}`);
  }
};

// Get escrow balance
export const getEscrowBalance = async (bountyId: number) => {
  try {
    if (!starkQuestMinimal) {
      initializeContracts();
    }
    
    const balance = await starkQuestMinimal?.get_escrow_balance(bountyId);
    return balance;
  } catch (error) {
    throw new Error(`Failed to get escrow balance: ${(error as Error).message}`);
  }
};

// Get all bounties
export const getAllBounties = async () => {
  try {
    if (!starkQuestMinimal) {
      initializeContracts();
    }
    
    // Get bounty count
    const count = await starkQuestMinimal?.get_bounty_count();
    const bountyCount = parseInt(count.toString());
    
    // Get all bounty details
    const bounties = [];
    for (let i = 1; i <= bountyCount; i++) {
      const details = await getBountyById(i);
      bounties.push({
        id: i,
        details: details
      });
    }
    
    return bounties;
  } catch (error) {
    throw new Error(`Failed to get bounties: ${(error as Error).message}`);
  }
};