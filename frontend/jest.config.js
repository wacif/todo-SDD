/** @type {import('jest').Config} */
const config = {
  // Automatically clear mock history and calls between tests
  clearMocks: true,

  // The environment that your tests will run in
  testEnvironment: 'jest-environment-jsdom',

  // Directory/files to ignore from test execution
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/' // Exclude Playwright E2E tests from unit test run
  ],

  // Module file extensions for tests
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Setup files after environment
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // Transforms applied to code before testing
  transform: {
    // Use babel-jest for TypeScript/JavaScript files, relying on Next.js Babel presets
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // Mapping for module aliases defined in tsconfig.json and static files
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map @/ alias to src/
    '^better-auth/react$': '<rootDir>/__mocks__/better-auth/react.ts',
    '^better-auth/client/plugins$': '<rootDir>/__mocks__/better-auth/client-plugins.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock styles
    '\\.(gif|ttf|eot|svg|png|jpg)$': '<rootDir>/__mocks__/fileMock.js', // Mock assets
  },
};

module.exports = config;
