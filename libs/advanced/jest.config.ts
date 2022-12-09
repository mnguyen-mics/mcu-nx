module.exports = {
  displayName: 'advanced',
  preset: '../../jest.preset.js',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/advanced',
  setupFilesAfterEnv: ['./src/utils/Mocks.ts'],
};
