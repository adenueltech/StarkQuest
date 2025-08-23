# StarkEarn Backend Integration Guide

This document provides guidance for backend developers working on the StarkEarn platform. It outlines the backend integration points, required services, and implementation recommendations.

## Table of Contents

1. [Overview](#overview)
2. [Backend Architecture](#backend-architecture)
3. [Required Services](#required-services)
4. [Event Monitoring](#event-monitoring)
5. [API Endpoints](#api-endpoints)
6. [Data Storage](#data-storage)
7. [Security Considerations](#security-considerations)
8. [Deployment](#deployment)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Overview

The StarkEarn backend serves several critical functions that complement the smart contracts:

1. **Event Monitoring**: Listen to blockchain events and index relevant data
2. **User Management**: Store user profile information not on the blockchain
3. **Search Indexing**: Index content for fast search capabilities
4. **Notification System**: Send notifications based on platform activity
5. **Analytics**: Track platform usage and generate insights

## Backend Architecture

The backend should be designed as a microservices architecture with the following components:

### Event Listener Service

- Monitors StarkNet for contract events
- Processes and stores relevant data
- Handles event processing failures

### User Service

- Manages user profile information
- Handles user preferences and settings
- Manages social connections

### Search Service

- Indexes bounty content and user profiles
- Provides search capabilities
- Handles search analytics

### Notification Service

- Sends email and in-app notifications
- Manages notification preferences
- Tracks notification delivery

### Analytics Service

- Collects platform usage data
- Generates reports and insights
- Handles data aggregation

## Required Services

### 1. Event Monitoring Service

#### Purpose

Monitor blockchain events to keep the backend synchronized with on-chain state.

#### Implementation

```javascript
// Example event monitoring implementation
import { RpcProvider } from "starknet";

const provider = new RpcProvider({
  nodeUrl: process.env.STARKNET_RPC_URL,
});

// Monitor BountyCreated events
provider
  .getEvents({
    from_block: "latest",
    to_block: "latest",
    address: process.env.BOUNTY_REGISTRY_ADDRESS,
    keys: [["BountyCreated"]],
  })
  .then((events) => {
    // Process new bounties
    events.forEach((event) => {
      // Index bounty data
      // Send notifications
    });
  });
```

#### Events to Monitor

1. **BountyCreated** - Index new bounties for search
2. **ApplicationSubmitted** - Track application statistics
3. **ApplicationReviewed** - Update application status
4. **BountyCompleted** - Track completion statistics
5. **PaymentDistributed** - Track payment statistics

### 2. User Management Service

#### Purpose

Store user profile information that isn't stored on the blockchain.

#### Data Model

```javascript
// User profile model
{
  walletAddress: string,        // StarkNet wallet address
  username: string,             // User's display name
  email: string,                // Contact email
  avatar: string,               // Avatar URL
  bio: string,                  // User biography
  skills: string[],             // User skills
  social: {                     // Social media links
    twitter: string,
    github: string,
    linkedin: string
  },
  preferences: {                // User preferences
    notifications: {
      email: boolean,
      inApp: boolean
    },
    theme: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Search Indexing Service

#### Purpose

Index content for fast search capabilities.

#### Implementation

Use a search engine like Elasticsearch or Typesense to index:

- Bounty titles and descriptions
- User skills and teamise
- Tags and categories

#### Index Structure

```javascript
// Bounty index
{
  id: string,                   // Bounty ID
  title: string,                // Bounty title
  description: string,          // Bounty description
  tags: string[],               // Bounty tags
  category: string,             // Bounty category
  reward: number,               // Reward amount
  Asset: string,             // Reward Asset
  deadline: Date,               // Bounty deadline
  creator: string,              // Creator wallet address
  status: string,               // Bounty status
  createdAt: Date               // Creation date
}

// User index
{
  walletAddress: string,        // User wallet address
  username: string,             // User's display name
  skills: string[],             // User skills
  reputation: number,           // User reputation score
  completedBounties: number,    // Number of completed bounties
  totalEarnings: number         // Total earnings
}
```

### 4. Notification Service

#### Purpose

Send notifications to users based on platform activity.

#### Notification Types

1. **New Bounty** - Notify relevant users of new bounties
2. **Application Received** - Notify bounty creators of new applications
3. **Application Accepted/Rejected** - Notify bounty hunters of application status
4. **Bounty Completed** - Notify when a bounty is completed
5. **Payment Received** - Notify when payment is distributed

#### Implementation

```javascript
// Example notification sending
const sendNotification = async (userId, type, data) => {
  // Store notification in database
  await db.notifications.create({
    userId,
    type,
    data,
    read: false,
    createdAt: new Date(),
  });

  // Send email if user has email notifications enabled
  const user = await db.users.findById(userId);
  if (user.preferences.notifications.email) {
    await sendEmail(user.email, type, data);
  }
};
```

## API Endpoints

### User Management

#### GET /api/users/:walletAddress

Get user profile information

#### PUT /api/users/:walletAddress

Update user profile information

#### GET /api/users/:walletAddress/bounties

Get user's bounties

#### GET /api/users/:walletAddress/applications

Get user's applications

### Search

#### GET /api/search/bounties

Search bounties

#### GET /api/search/users

Search users

### Notifications

#### GET /api/notifications

Get user notifications

#### PUT /api/notifications/:id/read

Mark notification as read

#### DELETE /api/notifications/:id

Delete notification

### Analytics

#### GET /api/analytics/platform

Get platform statistics

#### GET /api/analytics/user/:walletAddress

Get user statistics

## Data Storage

### Database Schema

#### Users Table

```sql
CREATE TABLE users (
  wallet_address VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### User Skills Table

```sql
CREATE TABLE user_skills (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(255) REFERENCES users(wallet_address),
  skill VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### User Social Links Table

```sql
CREATE TABLE user_social_links (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(255) REFERENCES users(wallet_address),
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Notifications Table

```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_wallet_address VARCHAR(255) REFERENCES users(wallet_address),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

### Authentication

- Use wallet-based authentication
- Validate all requests with wallet signatures
- Implement rate limiting

### Data Validation

- Validate all input data
- Sanitize user-provided content
- Implement proper error handling

### API Security

- Use HTTPS for all API endpoints
- Implement proper CORS policies
- Validate API keys for external access

### Database Security

- Use parameterized queries to prevent SQL injection
- Implement proper database user permissions
- Regularly update database software

## Deployment

### Environment Requirements

- Node.js 16+
- PostgreSQL or compatible database
- Redis for caching
- Elasticsearch or Typesense for search

### Configuration

Set the following environment variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/StarkEarn
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200
STARKNET_RPC_URL=https://starknet-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

### Deployment Options

1. **Docker**: Use provided Dockerfile
2. **Cloud Platforms**: Deploy to AWS, Google Cloud, or Azure
3. **Kubernetes**: Use provided Kubernetes manifests

## Monitoring and Maintenance

### Health Checks

Implement health check endpoints for:

- Database connectivity
- Redis connectivity
- StarkNet node connectivity
- Search engine connectivity

### Logging

- Implement structured logging
- Log all important events
- Use appropriate log levels

### Performance Monitoring

- Monitor API response times
- Track database query performance
- Monitor event processing latency

### Backup and Recovery

- Implement regular database backups
- Test backup restoration procedures
- Implement disaster recovery plan

## Integration with Smart Contracts

### Data Synchronization

- Keep backend data synchronized with blockchain state
- Handle event processing failures gracefully
- Implement data reconciliation procedures

### Error Handling

- Handle smart contract errors appropriately
- Implement retry mechanisms for failed transactions
- Log all blockchain interactions

## Future Enhancements

### Caching

- Implement Redis caching for frequently accessed data
- Cache search results
- Cache user profiles

### Real-time Updates

- Implement WebSocket connections for real-time updates
- Push notifications to connected clients
- Implement presence tracking

### Solo Analytics

- Implement machine learning for bounty recommendations
- Track user behavior patterns
- Generate predictive analytics

## Support and Contact

For questions about the backend implementation or to report issues:

- GitHub: https://github.com/StarkEarn/backend
- Discord: https://discord.gg/StarkEarn
- Email: backend@StarkEarn.io
