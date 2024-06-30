module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import',
    'react-refresh',
    'unicorn',
    'unused-imports',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'import/named': 'warn',
    'import/no-unresolved': 'warn',
    'import/no-self-import': 'error',
    'import/no-default-export': 'warn',
    'import/order': 'error',
    'import/newline-after-import': 'error',
    'import/no-unused-modules': ['warn', { unusedExports: true }],
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
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'error',
    'react/no-unused-prop-types': 'warn',
    'prettier/prettier': 'error',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
  overrides: [
    {
      files: ['src/routes/**/*.{js,ts,jsx,tsx}'],
      rules: {
        'react/react-in-jsx-scope': 'off',
      },
    },
  ],
};
