import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '.svelte-kit/**',
      'build/**',
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'static/**',
      'playwright-report/**',
      'test-results/**',
      '.vercel/**',
      'src/lib/components/ui/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  prettierConfig,
  ...svelte.configs.prettier,
  // `eslint-plugin-prettier/recommended` reporta cada divergencia con
  // `.prettierrc` como error de ESLint. Sin esto, `pnpm lint` pasa con
  // archivos sin formatear. Va al final para que pise al resto.
  prettierPlugin,
  {
    // Scripts de mantenimiento en Node (p. ej. scripts/capture-lideris.mjs). El navegador
    // también: el código dentro de page.evaluate corre en la página.
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { 'no-console': ['error', { allow: ['warn', 'error'] }] },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
        extraFileExtensions: ['.svelte'],
      },
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/ban-ts-comment': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.svelte'],
        svelteFeatures: { experimentalGenerics: true },
      },
      globals: { ...globals.browser },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'svelte/require-each-key': 'error',
      'svelte/no-at-html-tags': 'error',
      'svelte/no-target-blank': 'error',
      'svelte/no-navigation-without-resolve': 'warn',
      'svelte/prefer-svelte-reactivity': 'warn',
    },
  },
  // molecules/templates reciben hrefs ya resueltos (resolve()) desde el layout o la página;
  // la regla sigue activa en routes/** y organisms/**.
  {
    files: ['src/lib/components/molecules/**'],
    rules: {
      'svelte/no-navigation-without-resolve': 'off',
    },
  },
  {
    files: ['src/lib/components/templates/**'],
    rules: {
      'svelte/no-navigation-without-resolve': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '$app/*',
                '$lib/api',
                '$lib/api/*',
                '$lib/domain',
                '$lib/domain/*',
                '$lib/stores',
                '$lib/stores/*',
                '$lib/components/organisms',
                '$lib/components/organisms/*',
              ],
              message:
                'Los templates son puros: no importan $app/*, api, domain, stores ni organisms (ver docs/architecture/layouts.md).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/+layout.svelte'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "MemberExpression[property.name='pathname'][object.type='MemberExpression'][object.property.name='url'][object.object.type='Identifier'][object.object.name='page']",
          message:
            'page.url.pathname no va en un +layout.svelte: el chrome lo decide la carpeta (ver docs/architecture/layouts.md).',
        },
      ],
    },
  },
);
