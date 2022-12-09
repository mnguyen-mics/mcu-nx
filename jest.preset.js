const nxPreset = require('@nrwl/jest/preset').default;

module.exports = {
  ...nxPreset,
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
};
