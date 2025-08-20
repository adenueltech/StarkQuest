# StarkQuest Backend Implementation Guide

This guide provides instructions for implementing the backend services for the StarkQuest platform.

## Overview

The StarkQuest backend serves several critical functions:
1. Event monitoring and indexing
2. User profile management
3. Search indexing
4. Notification system
5. Analytics and reporting

## Architecture

The backend should be implemented as a microservices architecture with the following components:

### 1. Event Listener Service

Monitors StarkNet for contract events and indexes relevant data.

```typescript
// services/event-listener.ts
import { RpcProvider } from "starknet";
import { CONTRACT_ADDRESSES } from "../config";
import { indexBountyCreated, indexApplicationSubmitted } from "./indexer";

const provider = new RpcProvider({
  nodeUrl: process.env.STARKNET_RPC_URL || "https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID"
});

export class EventListener {
  private lastProcessedBlock: number = 0;

  async start() {
    // Process events from the last processed block
    setInterval(async () => {
      await this.processEvents();
    }, 10000); // Check every 10 seconds
  }

  async processEvents() {
    try {
      // Get current block number
      const currentBlock = await provider.getBlock("latest");
      
      // Process events from last processed block to current block
      if (currentBlock.block_number > this.lastProcessedBlock) {
        await this.processBountyEvents(this.lastProcessedBlock, currentBlock.block_number);
        await this.processApplicationEvents(this.lastProcessedBlock, currentBlock.block_number);
        
        // Update last processed block
        this.lastProcessedBlock = currentBlock.block_number;
      }
    } catch (error) {
      console.error("Error processing events:", error);
    }
  }

  async processBountyEvents(fromBlock: number, toBlock: number) {
    try {
      // Get BountyCreated events
      const events = await provider.getEvents({
        address: CONTRACT_ADDRESSES.BOUNTY_FACTORY,
        keys: [["BountyCreated"]],
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock }
      });

      // Process each event
      for (const event of events.events) {
        await indexBountyCreated(event);
      }
    } catch (error) {
      console.error("Error processing bounty events:", error);
    }
  }

  async processApplicationEvents(fromBlock: number, toBlock: number) {
    try {
      // Get ApplicationSubmitted events
      const events = await provider.getEvents({
        address: CONTRACT_ADDRESSES.BOUNTY_REGISTRY,
        keys: [["ApplicationSubmitted"]],
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock }
      });

      // Process each event
      for (const event of events.events) {
        await indexApplicationSubmitted(event);
      }
    } catch (error) {
      console.error("Error processing application events:", error);
    }
  }
}
```

### 2. Indexing Service

Indexes data for fast search and retrieval.

```typescript
// services/indexer.ts
import { PrismaClient } from "@prisma/client";
import { Contract } from "starknet";
import bountyAbi from "../lib/abis/Bounty.json";

const prisma = new PrismaClient();

export async function indexBountyCreated(event: any) {
  try {
    // Extract data from event
    const bountyAddress = event.data[0];
    const creator = event.data[1];
    const bountyId = parseInt(event.data[2]);

    // Get bounty details from contract
    const provider = getProvider(); // Implement this function
    const bountyContract = new Contract(bountyAbi, bountyAddress, provider);
    
    const [title, description, rewardAmount, deadline, tokenAddress, status] = 
      await bountyContract.get_bounty_details();

    // Index bounty in database
    await prisma.bounty.create({
      data: {
        id: bountyId,
        address: bountyAddress,
        creator,
        title: title.toString(),
        description: description.toString(),
        rewardAmount: rewardAmount.toString(),
        deadline: new Date(deadline.toString() * 1000),
        tokenAddress: tokenAddress.toString(),
        status: status.toString(),
        createdAt: new Date()
      }
    });

    console.log(`Indexed bounty ${bountyId}`);
  } catch (error) {
    console.error("Error indexing bounty:", error);
  }
}

export async function indexApplicationSubmitted(event: any) {
  try {
    // Extract data from event
    const applicant = event.data[0];
    const timestamp = parseInt(event.data[1]);

    // Index application in database
    await prisma.application.create({
      data: {
        applicant,
        timestamp: new Date(timestamp * 1000),
        bountyId: event.data[2] ? parseInt(event.data[2]) : null
      }
    });

    console.log(`Indexed application from ${applicant}`);
  } catch (error) {
    console.error("Error indexing application:", error);
  }
}
```

### 3. User Service

Manages user profiles and preferences.

```typescript
// services/user-service.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserService {
  async createUser(walletAddress: string, username: string) {
    try {
      const user = await prisma.user.create({
        data: {
          walletAddress,
          username,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  async getUserByWallet(walletAddress: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { walletAddress }
      });
      
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error}`);
    }
  }

  async updateUserProfile(walletAddress: string, data: Partial<UserProfile>) {
    try {
      const user = await prisma.user.update({
        where: { walletAddress },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });
      
      return user;
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  async getUserBounties(walletAddress: string) {
    try {
      const bounties = await prisma.bounty.findMany({
        where: {
          OR: [
            { creator: walletAddress },
