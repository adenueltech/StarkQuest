#!/usr/bin/env node

// Test runner for StarkEarn integration tests
import runIntegrationTests from "../tests/integration-test";

async function main() {
  console.log("🚀 Starting StarkEarn Integration Tests...\n");

  try {
    await runIntegrationTests();
    console.log("\n✅ All tests completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Tests failed:", error);
    process.exit(1);
  }
}

// Run the tests
main();
