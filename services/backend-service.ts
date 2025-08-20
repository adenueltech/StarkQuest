import { eventMonitor } from './event-monitor';
import { initializeContracts } from '../lib/services/starknet';

// Backend service class
export class BackendService {
  private isRunning: boolean = false;

  // Start the backend service
  async start() {
    if (this.isRunning) {
      console.log("Backend service is already running");
      return;
    }

    console.log("Starting StarkQuest backend service...");
    
    // Initialize contracts
    try {
      initializeContracts();
      console.log("Contracts initialized successfully");
    } catch (error) {
      console.error("Failed to initialize contracts:", error);
      throw error;
    }

    // Start event monitor
    try {
      await eventMonitor.start();
      console.log("Event monitor started successfully");
    } catch (error) {
      console.error("Failed to start event monitor:", error);
      throw error;
    }

    this.isRunning = true;
    console.log("StarkQuest backend service started successfully");
  }

  // Stop the backend service
  async stop() {
    if (!this.isRunning) {
      console.log("Backend service is not running");
      return;
    }

    console.log("Stopping StarkQuest backend service...");
    
    // Stop event monitor
    eventMonitor.stop();
    
    this.isRunning = false;
    console.log("StarkQuest backend service stopped successfully");
  }

  // Health check
  async healthCheck() {
    return {
      status: this.isRunning ? "running" : "stopped",
      timestamp: new Date().toISOString(),
      services: {
        eventMonitor: "running",
        contracts: "initialized"
      }
    };
  }
}

// Export a singleton instance
export const backendService = new BackendService();

// Start the backend service if this file is run directly
if (require.main === module) {
  backendService.start()
    .then(() => {
      console.log("Backend service started successfully");
      
      // Handle graceful shutdown
      process.on('SIGTERM', async () => {
        console.log('SIGTERM received, shutting down gracefully');
        await backendService.stop();
        process.exit(0);
      });

      process.on('SIGINT', async () => {
        console.log('SIGINT received, shutting down gracefully');
        await backendService.stop();
        process.exit(0);
      });
    })
    .catch((error) => {
      console.error("Failed to start backend service:", error);
      process.exit(1);
    });
}