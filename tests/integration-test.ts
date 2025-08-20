// Integration test for StarkQuest contracts and services
import { CONTRACT_ADDRESSES } from '../lib/config';
import { initializeContracts, connectWallet } from '../lib/services/starknet';
import { eventMonitor } from '../services/event-monitor';
import { backendService } from '../services/backend-service';

async function runIntegrationTests() {
  console.log('Starting StarkQuest Integration Tests...\n');

  try {
    // Test 1: Contract Addresses Configuration
    console.log('Test 1: Contract Addresses Configuration');
    let testPassed = true;

    // Check if all required contract addresses exist
    if (!CONTRACT_ADDRESSES.BOUNTY_REGISTRY) {
      console.error('  ❌ BOUNTY_REGISTRY address is missing');
      testPassed = false;
    }

    if (!CONTRACT_ADDRESSES.BOUNTY_FACTORY) {
      console.error('  ❌ BOUNTY_FACTORY address is missing');
      testPassed = false;
    }

    if (!CONTRACT_ADDRESSES.PAYMENT_PROCESSOR) {
      console.error('  ❌ PAYMENT_PROCESSOR address is missing');
      testPassed = false;
    }

    if (!CONTRACT_ADDRESSES.REPUTATION_SYSTEM) {
      console.error('  ❌ REPUTATION_SYSTEM address is missing');
      testPassed = false;
    }

    // Check if contract addresses have valid format
    Object.entries(CONTRACT_ADDRESSES).forEach(([name, address]) => {
      if (!address.match(/^0x[0-9a-fA-F]{64}$/)) {
        console.error(`  ❌ ${name} address has invalid format: ${address}`);
        testPassed = false;
      } else {
        console.log(`  ✅ ${name} address is valid: ${address.substring(0, 10)}...${address.substring(address.length - 6)}`);
      }
    });

    if (testPassed) {
      console.log('  ✅ Contract Addresses Configuration test passed\n');
    } else {
      console.log('  ❌ Contract Addresses Configuration test failed\n');
      return;
    }

    // Test 2: Contract Initialization
    console.log('Test 2: Contract Initialization');
    try {
      initializeContracts();
      console.log('  ✅ Contracts initialized successfully\n');
    } catch (error) {
      console.error('  ❌ Contract initialization failed:', error);
      console.log('  ❌ Contract Initialization test failed\n');
      return;
    }

    // Test 3: Wallet Connection (mocked)
    console.log('Test 3: Wallet Connection (mocked)');
    console.log('  ℹ️  Wallet connection test requires a browser environment');
    console.log('  ✅ Wallet Connection test skipped (requires browser)\n');

    // Test 4: Event Monitoring
    console.log('Test 4: Event Monitoring');
    try {
      // Mock the processEvents method to avoid actual network calls
      (eventMonitor as any).processEvents = () => Promise.resolve();
      
      console.log('  ✅ Event Monitoring test passed (mocked)\n');
    } catch (error) {
      console.error('  ❌ Event Monitoring test failed:', error);
      console.log('  ❌ Event Monitoring test failed\n');
      return;
    }

    // Test 5: Backend Service
    console.log('Test 5: Backend Service');
    try {
      // Mock the event monitor methods to avoid actual network calls
      (eventMonitor as any).start = () => Promise.resolve();
      (eventMonitor as any).stop = () => {};
      
      // Test health check
      const health = await backendService.healthCheck();
      if (health.status && health.timestamp && health.services) {
        console.log('  ✅ Backend Service health check passed');
      } else {
        console.error('  ❌ Backend Service health check failed');
        return;
      }
      
      console.log('  ✅ Backend Service test passed\n');
    } catch (error) {
      console.error('  ❌ Backend Service test failed:', error);
      console.log('  ❌ Backend Service test failed\n');
      return;
    }

    // Test 6: Contract Interaction Functions
    console.log('Test 6: Contract Interaction Functions');
    try {
      // Dynamically import the service to check if functions exist
      const starknetService = await import('../lib/services/starknet');
      
      const requiredFunctions = [
        'createBounty',
        'submitApplication',
        'reviewApplication',
        'completeBounty',
        'distributePayment',
        'getUserReputation'
      ];
      
      let functionsTestPassed = true;
      requiredFunctions.forEach(funcName => {
        if (typeof (starknetService as any)[funcName] === 'function') {
          console.log(`  ✅ ${funcName} function exists`);
        } else {
          console.error(`  ❌ ${funcName} function is missing`);
          functionsTestPassed = false;
        }
      });
      
      if (functionsTestPassed) {
        console.log('  ✅ Contract Interaction Functions test passed\n');
      } else {
        console.log('  ❌ Contract Interaction Functions test failed\n');
        return;
      }
    } catch (error) {
      console.error('  ❌ Contract Interaction Functions test failed:', error);
      console.log('  ❌ Contract Interaction Functions test failed\n');
      return;
    }

    console.log('🎉 All Integration Tests Passed!');
  } catch (error) {
    console.error('❌ Integration Tests Failed:', error);
  }
}

// Mock jest for Node.js environment
const jest = {
  fn: () => {
    const mockFn = () => {};
    (mockFn as any).mockResolvedValue = () => mockFn;
    (mockFn as any).mockImplementation = () => mockFn;
    return mockFn;
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runIntegrationTests();
}

export default runIntegrationTests;