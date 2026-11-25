import { reactLint } from '@openspace/shared-configs/eslint/react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/']
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.d.ts'],
    extends: [reactLint],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // The SGCT converters work on untyped XML and JSON input, which still uses `any`
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
);
