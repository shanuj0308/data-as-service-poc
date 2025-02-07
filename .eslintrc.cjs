module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'simple-import-sort', '@typescript-eslint'],
  rules: {
    'react/prop-types': 'off',
    'react-refresh/only-export-components': 'off',
    'react/no-unescaped-entities': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages `react` related packages come first.
          [
            '^react',
            '^\\w',
            '^@hookform',
            '^@radix-ui',
            '^@tanstack',
            '@vitejs',
          ],
          // npm packages
          // Anything that starts with a letter (or digit or underscore), or `@` followed by a letter.
          // ['^\\w'],
          // Internal packages.
          ['^@store(/.*|$)'],
          ['^@components(/.*|$)'],
          ['^@ui(/.*|$)'],
          ['^@lib(/.*|$)'],
          ['^@pages(/.*|$)'],
          ['^@utils(/.*|$)'],
          ['^@hooks(/.*|$)'],
          ['^@services(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.?(css)$'],
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error'],
      },
    },
  ],
};
