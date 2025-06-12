module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__/operations'],
  collectCoverage: true,
  collectCoverageFrom: ['src/operations/**/*.ts'],
};
