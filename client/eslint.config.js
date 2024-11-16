import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  { ignores: ['dist'] },
  {
    name: 'js: recommended',
    ...js.configs.recommended,
  },
  {
    name: 'prettier: recommended',
    ...eslintPluginPrettierRecommended,
  },
  ...tseslint.configs.recommended,
  {
    name: 'global languageOptions',
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    name: 'stylistic',
    plugins: {
      '@stylistic/js': stylistic,
      '@stylistic/ts': stylistic,
    },
    rules: {
      '@stylistic/js/semi': ['error', 'always'],
      '@stylistic/js/block-spacing': ['error', 'always'],
      '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/js/no-mixed-operators': 'error',
      '@stylistic/js/lines-around-comment': [
        'error',
        {
          beforeBlockComment: false,
          allowBlockStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
        },
      ],
      '@stylistic/js/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: ['return', 'export', 'function'],
        },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
    },
  },
  {
    name: 'typescript',
    rules: {
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
    },
  },
  {
    name: 'global rules',
    rules: {
      'no-redeclare': ['off'],
      'no-unused-vars': ['off'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unexpected-multiline': 'error',
      'no-var': 'error',
      'no-unsafe-optional-chaining': 'error',
      curly: ['error', 'all'],
      'arrow-body-style': ['error', 'as-needed'],
      'no-sparse-arrays': ['off'],
      'func-style': ['error'],
    },
  },
  {
    name: 'prettier',
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 120,
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],
    },
  },
];
