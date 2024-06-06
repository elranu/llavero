module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': ['ts-jest', { tsconfig: '../../tsconfig.json' }],
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironmentOptions: {
    experimentalVmModules: true,
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
