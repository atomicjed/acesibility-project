export default {
  collectCoverage: true,
  preset: 'ts-jest',
  coverageDirectory: './coverage',
  coverageReporters: ['json'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useEsm: true,
    }],
    // process `*.tsx` files with `ts-jest`
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy", // Keeps CSS imports as mock objects
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};