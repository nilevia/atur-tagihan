module.exports = {
  collectCoverageFrom: [
    '**/pages/**/*.{js,jsx,ts,tsx}',
    '**/components/**/*.{js,jsx,ts,tsx}',
    '**/utils/**/*.js',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!pages/_app.js',
    '!pages/_document.js',
  ],
  collectCoverage: true,
  coverageReporters: ['text', 'html', 'lcov'],
  coverageDirectory: '<rootDir>/coverage/',
  setupFilesAfterEnv: ['<rootDir>/enzyme.js', 'jest-localstorage-mock'],
  testResultsProcessor: 'jest-sonar-reporter',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    // '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  // snapshotSerializers: ["enzyme-to-json/serializer"],
};
