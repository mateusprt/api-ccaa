const { createDefaultPreset } = require('ts-jest');
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: { ...tsJestTransformCfg },
  testMatch: ['**/?(*.)+(spec|test).ts'], // garante .ts
  // ou: testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$'
};
