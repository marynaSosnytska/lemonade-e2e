import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import playwright from 'eslint-plugin-playwright'

export default [
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  { files: ['**/*.mjs'], ...tseslint.configs.disableTypeChecked },
  {
    files: ['src/framework/step-decorator.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
  { files: ['tests/**'], ...playwright.configs['flat/recommended'] },
  {
    files: ['tests/**/*.spec.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              importNames: ['test'],
              message: "Import test from '@fixtures/test' instead.",
            },
          ],
        },
      ],
      'playwright/expect-expect': [
        'warn',
        { assertFunctionNames: ['expect'], assertFunctionPatterns: ['^verify'] },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'test', property: 'only', message: 'test.only must not be committed.' },
      ],
    },
  },
]
