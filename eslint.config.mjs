// eslint.config.js
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  {
    ...js.configs.recommended,
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: {
        ...(tseslint.configs.recommended.languageOptions?.globals || {}),
        ...globals.browser,
        ...globals.es2021,
        RequestCredentials: 'readonly', // Ensure RequestCredentials type is available
        RequestInit: 'readonly', // Ensure RequestInit type is available
        HeadersInit: 'readonly', // Ensure HeadersInit type is available
        RequestInfo: 'readonly', // Ensure RequestInfo type is available
        XMLHttpRequestBodyInit: 'readonly', // Ensure XMLHttpRequestBodyInit type is available
        BlobPart: 'readonly', // Ensure BlobPart type is available
      },
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...(tseslint.configs.recommended.languageOptions?.globals || {}),
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  prettier,
];
