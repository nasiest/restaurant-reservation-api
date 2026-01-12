// jest.setup.ts
import redis from './src/utils/redis';

// Mock Redis so tests don’t attempt real connections
jest.mock('./src/utils/redis', () => {
  return {
    default: {
      on: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      quit: jest.fn().mockResolvedValue(true),
    },
  };
});

// Optionally mock DB for isolated tests
jest.mock('./src/utils/db', () => {
  return {
    query: jest.fn(),
  };
});

// Close Redis after all tests (safety net)
afterAll(async () => {
  if (redis && redis.quit) {
    await redis.quit();
  }
});
