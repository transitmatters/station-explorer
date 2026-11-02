import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', '.venv', 'server', 'eslint.config.js', 'vite.config.ts']),
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.es2020 },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      unicorn,
      'unused-imports': unusedImports,
      prettier: prettierPlugin,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      'import/named': 'warn',
      'import/no-unresolved': 'warn',
      'import/no-self-import': 'error',
      'import/no-default-export': 'warn',
      'import/order': 'error',
      'import/newline-after-import': 'error',
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true,
        },
      ],
      'import/max-dependencies': [
        'warn',
        {
          max: 20,
          ignoreTypeImports: false,
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'no-console': 'error',
      'no-empty': 'error',
      'unicorn/no-empty-file': 'error',
      'no-warning-comments': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      'prefer-destructuring': [
        'warn',
        {
          array: false,
          object: true,
        },
      ],
      eqeqeq: ['error', 'smart'],
      'react/prop-types': 'warn',
      'react/jsx-no-target-blank': 'warn',
      'react/no-unescaped-entities': 'off',
      // Only the classic hooks rules; react-hooks 7's recommended preset adds React Compiler rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'error',
      'react/no-unused-prop-types': 'warn',
      'prettier/prettier': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['src/routes/**/*.{js,ts,jsx,tsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
]);
