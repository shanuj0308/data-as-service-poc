export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust this if you use path aliases
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)?$': 'babel-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  verbose: true,
  transformIgnorePatterns: ['node_modules/(?!' + ['lucide-react', 'msal-react-tester'].join('|') + ')'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/constant/secret.ts', // Add the path to the file you want to ignore
    '<rootDir>/src/components/reportingComponents/exportPopup.tsx',
    '<rootDir>/src/components/reportingComponents/reportingTopbar.tsx',
    '<rootDir>/src/components/reportingComponents/ColumnSelectionDataTable.tsx',
    '<rootDir>/src/components/common/Header.tsx',
    '<rootDir>/src/apis/',
    '<rootDir>/src/hooks/',
    '<rootDir>/src/lib',
  ],
};
