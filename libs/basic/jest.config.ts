export default {
  // Setup jest typescript
  displayName: 'basic',
  preset: '../../jest.preset.js',
  roots: ['<rootDir>/src'],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  setupFilesAfterEnv: ['./src/utils/Mocks.ts', '<rootDir>/setupEnzyme.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageDirectory: '../../coverage/libs/basic',
};
