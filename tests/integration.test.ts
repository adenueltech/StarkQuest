// Integration tests for StarkQuest contracts and services
import { Account, RpcProvider } from 'starknet';
import { CONTRACT_ADDRESSES } from '../lib/config';
import { initializeContracts, connectWallet } from '../lib/services/starknet';
import { eventMonitor } from '../services/event-monitor';
import { backendService } from '../services/backend-service';

// Mock wallet connection for testing
jest.mock('../lib/services/starknet', () => {
  const originalModule = jest.requireActual('../lib/services/starknet');
  
  return {
    ...originalModule,
    connectWallet: jest.fn().mockResolvedValue('0x123456789abcdef'),
  };
});

describe('StarkQuest Integration Tests', () => {
  // Initialize before all tests
  beforeAll(async () => {
    // Initialize contracts
    initializeContracts();
  });

  // Test contract addresses configuration
  describe('Contract Addresses Configuration', () => {
    it('should have all required contract addresses', () => {
      expect(CONTRACT_ADDRESSES.BOUNTY_REGISTRY).toBeDefined();
      expect(CONTRACT_ADDRESSES.BOUNTY_FACTORY).toBeDefined();
      expect(CONTRACT_ADDRESSES.PAYMENT_PROCESSOR).toBeDefined();
      expect(CONTRACT_ADDRESSES.REPUTATION_SYSTEM).toBeDefined();
      expect(CONTRACT_ADDRESSES.STARK_EARN).toBeDefined();
    });

    it('should have valid contract address format', () => {
      Object.values(CONTRACT_ADDRESSES).forEach(address => {
        expect(address).toMatch(/^0x[0-9a-fA-F]{64}$/);
      });
    });
  });

  // Test contract initialization
  describe('Contract Initialization', () => {
    it('should initialize all contracts without error', () => {
      expect(() => {
        initializeContracts();
      }).not.toThrow();
    });
  });

  // Test wallet connection
  describe('Wallet Connection', () => {
    it('should connect wallet successfully', async () => {
      const result = await connectWallet();
      expect(result).toBeDefined();
      expect(result).toMatch(/^0x[0-9a-fA-F]{64}$/);
    });
  });

  // Test event monitoring
  describe('Event Monitoring', () => {
    it('should start event monitor without error', async () => {
      // Mock the provider to avoid actual network calls
      jest.spyOn(eventMonitor as any, 'processEvents').mockResolvedValue(undefined);
      
      await expect(eventMonitor.start()).resolves.not.toThrow();
    });

    it('should stop event monitor without error', () => {
      expect(() => {
        eventMonitor.stop();
      }).not.toThrow();
    });
  });

  // Test backend service
  describe('Backend Service', () => {
    it('should start backend service without error', async () => {
      // Mock the event monitor to avoid actual network calls
      jest.spyOn(eventMonitor, 'start').mockResolvedValue(undefined);
      jest.spyOn(eventMonitor, 'stop').mockImplementation(() => {});
      
      await expect(backendService.start()).resolves.not.toThrow();
    });

    it('should stop backend service without error', async () => {
      await expect(backendService.stop()).resolves.not.toThrow();
    });

    it('should provide health check information', async () => {
      const health = await backendService.healthCheck();
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('timestamp');
      expect(health).toHaveProperty('services');
    });
  });

  // Test contract interaction functions
  describe('Contract Interaction Functions', () => {
    // Note: These tests would require a local starknet-devnet or testnet setup
    // For now, we'll just check that the functions exist and can be called
    
    it('should have createBounty function', async () => {
      const { createBounty } = await import('../lib/services/starknet');
      expect(typeof createBounty).toBe('function');
    });

    it('should have submitApplication function', async () => {
      const { submitApplication } = await import('../lib/services/starknet');
      expect(typeof submitApplication).toBe('function');
    });

    it('should have reviewApplication function', async () => {
      const { reviewApplication } = await import('../lib/services/starknet');
      expect(typeof reviewApplication).toBe('function');
    });

    it('should have completeBounty function', async () => {
      const { completeBounty } = await import('../lib/services/starknet');
      expect(typeof completeBounty).toBe('function');
    });

    it('should have distributePayment function', async () => {
      const { distributePayment } = await import('../lib/services/starknet');
      expect(typeof distributePayment).toBe('function');
    });

    it('should have getUserReputation function', async () => {
      const { getUserReputation } = await import('../lib/services/starknet');
      expect(typeof getUserReputation).toBe('function');
    });
  });
});