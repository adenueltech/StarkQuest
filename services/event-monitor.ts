import { RpcProvider } from "starknet";
import { CONTRACT_ADDRESSES } from "../lib/config";

// Initialize provider
const provider = new RpcProvider({
  nodeUrl: process.env.STARKNET_RPC_URL || "https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID"
});

// Event listener class
export class EventMonitor {
  private lastProcessedBlock: number = 0;
  private isRunning: boolean = false;

  // eeef


  // yhfufhf

  // Start monitoring events
  async start() {
    if (this.isRunning) {
      console.log("Event monitor is already running");
      return;
    }

    this.isRunning = true;
    console.log("Starting event monitor...");

    // Process events immediately on start
    await this.processEvents();

    // Set up interval to process events every 10 seconds
    setInterval(async () => {
      if (this.isRunning) {
        await this.processEvents();
      }
    }, 10000);
  }

  // Stop monitoring events
  stop() {
    this.isRunning = false;
    console.log("Event monitor stopped");
  }

  // Process events from the last processed block
  async processEvents() {
    try {
      // Get current block number
      const currentBlock = await provider.getBlock("latest");
      
      // Process events from last processed block to current block
      if (currentBlock.block_number > this.lastProcessedBlock) {
        console.log(`Processing events from block ${this.lastProcessedBlock} to ${currentBlock.block_number}`);
        
        await this.processBountyEvents(this.lastProcessedBlock, currentBlock.block_number);
        await this.processApplicationEvents(this.lastProcessedBlock, currentBlock.block_number);
        await this.processPaymentEvents(this.lastProcessedBlock, currentBlock.block_number);
        
        // Update last processed block
        this.lastProcessedBlock = currentBlock.block_number;
      }
    } catch (error) {
      console.error("Error processing events:", error);
    }
  }

  // Process bounty events
  async processBountyEvents(fromBlock: number, toBlock: number) {
    try {
      // Get BountyCreated events from BountyFactory
      const bountyCreatedEvents = await provider.getEvents({
        address: CONTRACT_ADDRESSES.BOUNTY_FACTORY,
        keys: [["0x025140f101d834a205b10211031311800000000000000000000000000000000"]], // Event key for BountyCreated
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        chunk_size: 100
      });

      // Process each event
      for (const event of bountyCreatedEvents.events) {
        await this.indexBountyCreated(event);
      }

      // Get BountyCancelled events from individual Bounty contracts
      // Note: These events are emitted by individual bounty contracts, not the registry
      // In a real implementation, you would need to monitor all bounty contracts
    } catch (error) {
      console.error("Error processing bounty events:", error);
    }
  }

  // Process application events
  async processApplicationEvents(fromBlock: number, toBlock: number) {
    try {
      // Get ApplicationSubmitted events from individual Bounty contracts
      // Note: These events are emitted by individual bounty contracts
      // In a real implementation, you would need to monitor all bounty contracts or use a different approach
    } catch (error) {
      console.error("Error processing application events:", error);
    }
  }

  // Process payment events
  async processPaymentEvents(fromBlock: number, toBlock: number) {
    try {
      // Get PaymentProcessed events from PaymentProcessor
      const paymentProcessedEvents = await provider.getEvents({
        address: CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
        keys: [["0x01965202187a841c6f028325e41281400000000000000000000000000000000"]], // Event key for PaymentProcessed
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        chunk_size: 100
      });

      // Process each event
      for (const event of paymentProcessedEvents.events) {
        await this.indexPaymentProcessed(event);
      }

      // Get RefundProcessed events from PaymentProcessor
      const refundProcessedEvents = await provider.getEvents({
        address: CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
        keys: [["0x01e851d940111189812140a5100814000000000000000000000000000000000"]], // Event key for RefundProcessed
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        chunk_size: 100
      });

      // Process each event
      for (const event of refundProcessedEvents.events) {
        await this.indexRefundProcessed(event);
      }

      // Get PlatformFeeCollected events from PaymentProcessor
      const platformFeeEvents = await provider.getEvents({
        address: CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
        keys: [["0x029512181821031100100108100000000000000000000000000000000000000"]], // Event key for PlatformFeeCollected
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        chunk_size: 100
      });

      // Process each event
      for (const event of platformFeeEvents.events) {
        await this.indexPlatformFeeCollected(event);
      }
    } catch (error) {
      console.error("Error processing payment events:", error);
    }
  }

  // Index bounty created event
  async indexBountyCreated(event: any) {
    try {
      // Extract data from event
      const bountyAddress = event.data[0];
      const creator = event.data[1];
      const bountyId = parseInt(event.data[2]);
      
      console.log(`Indexing new bounty: ${bountyId} at ${bountyAddress} created by ${creator}`);
      
      // In a real implementation, you would:
      // 1. Connect to a database
      // 2. Insert the bounty data into the database
      // 3. Update any related indexes or search indices
      
      // Example database insertion (pseudo-code):
      // await database.bounties.insert({
      //   id: bountyId,
      //   address: bountyAddress,
      //   creator: creator,
      //   createdAt: new Date(),
      //   status: 'open'
      // });
      
    } catch (error) {
      console.error("Error indexing bounty created event:", error);
    }
  }

  // Index payment processed event
  async indexPaymentProcessed(event: any) {
    try {
      // Extract data from event
      const bountyAddress = event.data[0];
      const hunter = event.data[1];
      const amount = event.data[2];
      const platformFee = event.data[3];
      
      console.log(`Indexing payment: ${amount} processed for ${hunter} for bounty ${bountyAddress}, platform fee: ${platformFee}`);
      
      // In a real implementation, you would:
      // 1. Connect to a database
      // 2. Insert the payment data into the database
      // 3. Update the hunter's earnings
      // 4. Update any related indexes or search indices
      
    } catch (error) {
      console.error("Error indexing payment processed event:", error);
    }
  }

  // Index refund processed event
  async indexRefundProcessed(event: any) {
    try {
      // Extract data from event
      const bountyAddress = event.data[0];
      const creator = event.data[1];
      const amount = event.data[2];
      
      console.log(`Indexing refund: ${amount} processed for ${creator} for bounty ${bountyAddress}`);
      
      // In a real implementation, you would:
      // 1. Connect to a database
      // 2. Insert the refund data into the database
      // 3. Update any related indexes or search indices
      
    } catch (error) {
      console.error("Error indexing refund processed event:", error);
    }
  }

  // Index platform fee collected event
  async indexPlatformFeeCollected(event: any) {
    try {
      // Extract data from event
      const amount = event.data[0];
      
      console.log(`Indexing platform fee collected: ${amount}`);
      
      // In a real implementation, you would:
      // 1. Connect to a database
      // 2. Insert the platform fee data into the database
      // 3. Update any related indexes or search indices
      
    } catch (error) {
      console.error("Error indexing platform fee collected event:", error);
    }
  }
}

// Export a singleton instance
export const eventMonitor = new EventMonitor();