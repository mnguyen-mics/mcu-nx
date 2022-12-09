export default {
  // Setup jest typescript
  displayName: 'basic',
  preset: '../../jest.preset.js',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['./src/utils/Mocks.ts', '<rootDir>/setupEnzyme.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageDirectory: '../../coverage/libs/basic',
};
