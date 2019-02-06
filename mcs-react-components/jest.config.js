module.exports = {
  // Setup jest typescript
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // Setup Enzyme
  setupTestFrameworkScriptFile: "<rootDir>/setupEnzyme.ts"
};
