// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
   preset: 'ts-jest',             // Uses ts-jest to transpile TypeScript files
   testEnvironment: 'node',        // Node environment for backend testing
   testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'], // Test file pattern
   moduleFileExtensions: ['ts', 'js'], // Recognize both .ts and .js files
   clearMocks: true,               // Clears mocks after each test
   
};

export default config;
