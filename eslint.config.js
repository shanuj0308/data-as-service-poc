import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended], // Extends the recommended configurations for JavaScript and TypeScript.
    files: ['**/*.{ts,tsx}'], // Specifies that the configuration applies to TypeScript and TypeScript React files.
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },// Sets the ECMAScript version to 2020 and includes browser globals.
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },// Registers the react-hooks and react-refresh plugins.
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },// Sets custom rules, including recommended rules for React hooks and a custom rule for React Refresh.
  },
)
