module.exports = {
  // Setup jest typescript
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./src/utils/Mocks.ts'],
};
