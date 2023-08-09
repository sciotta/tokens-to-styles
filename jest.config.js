module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'], // Adjust the path to your source code directory
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
