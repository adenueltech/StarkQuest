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
      // Get BountyCreated events
      const bountyCreatedEvents = await provider.getEvents({
        address: CONTRACT_ADDRESSES.BOUNTY_FACTORY,
        keys: [["0x030734633c61b99d762764217043999999999999999999999999999999999999"]], // Placeholder key
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        chunk_size: 100
      });

      // Process each event
      for (const event of bountyCreatedEvents.events) {
        await this.indexBountyCreated(event);
      }

      // Get BountyCompleted events
      const bountyCompletedEvents = await provider.getEvents({
        address: CONTRACT_ADDRESSES.BOUNTY_REGISTRY,
        keys: [["0x040734633c61b99d762764217043999999999999999999999999999999999999"]], // Placeholder key
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        chunk_size: 100
      });

      // Process each event
      for (const event of bountyCompletedEvents.events) {
        await this.indexBountyCompleted(event);
      }
    } catch (error) {
      console.error("Error processing bounty events:", error);
    }
  }

  // Process application events
  async processApplicationEvents(fromBlock: number, toBlock: number) {
    try {
      // Get ApplicationSubmitted events
      const applicationEvents = await provider.getEvents({
        address: CONTRACT_ADDRESSES.BOUNTY_REGISTRY,
        keys: [["0x050734633c61b99d762764217043999999999999999999999999999999999999"]], // Placeholder key
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        chunk_size: 100
      });

      // Process each event
      for (const event of applicationEvents.events) {
        await this.indexApplicationSubmitted(event);
      }
    } catch (error) {
      console.error("Error processing application events:", error);
    }
  }

  // Process payment events
  async processPaymentEvents(fromBlock: number, toBlock: number) {
    try {
      // Get PaymentDistributed events
      const paymentEvents = await provider.getEvents({
        address: CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
        keys: [["0x060734633c61b99d762764217043999999999999999999999999999999999999"]], // Placeholder key
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        chunk_size: 100
      });

      // Process each event
      for (const event of paymentEvents.events) {
        await this.indexPaymentDistributed(event);
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

  // Index bounty completed event
  async indexBountyCompleted(event: any) {
    try {
      // Extract data from event
      const bountyAddress = event.data[0];
      const hunter = event.data[1];
      
      console.log(`Indexing completed bounty: ${bountyAddress} completed by ${hunter}`);
      
      // In a real implementation, you would:
      // 1. Connect to a database
      // 2. Update the bounty status in the database
      // 3. Update the hunter's reputation score
      // 4. Update any related indexes or search indices
      
      // Example database update (pseudo-code):
      // await database.bounties.update(
      //   { address: bountyAddress },
      //   { 
      //     status: 'completed',
      //     completedBy: hunter,
      //     completedAt: new Date()
      //   }
      // );
      
    } catch (error) {
      console.error("Error indexing bounty completed event:", error);
    }
  }

  // Index application submitted event
  async indexApplicationSubmitted(event: any) {
    try {
      // Extract data from event
      const applicant = event.data[0];
      const bountyAddress = event.data[1];
      
      console.log(`Indexing application: ${applicant} applied to ${bountyAddress}`);
      
      // In a real implementation, you would:
      // 1. Connect to a database
      // 2. Insert the application data into the database
      // 3. Update any related indexes or search indices
      
      // Example database insertion (pseudo-code):
      // await database.applications.insert({
      //   applicant: applicant,
      //   bountyAddress: bountyAddress,
      //   submittedAt: new Date(),
      //   status: 'pending'
      // });
      
    } catch (error) {
      console.error("Error indexing application submitted event:", error);
    }
  }

  // Index payment distributed event
  async indexPaymentDistributed(event: any) {
    try {
      // Extract data from event
      const bountyAddress = event.data[0];
      const hunter = event.data[1];
      const amount = event.data[2];
      
      console.log(`Indexing payment: ${amount} distributed to ${hunter} for ${bountyAddress}`);
      
      // In a real implementation, you would:
      // 1. Connect to a database
      // 2. Insert the payment data into the database
      // 3. Update the hunter's earnings
      // 4. Update any related indexes or search indices
      
      // Example database insertion (pseudo-code):
      // await database.payments.insert({
      //   bountyAddress: bountyAddress,
      //   hunter: hunter,
      //   amount: amount,
      //   distributedAt: new Date()
      // });
      
    } catch (error) {
      console.error("Error indexing payment distributed event:", error);
    }
  }
}

// Export a singleton instance
export const eventMonitor = new EventMonitor();