import antfu from '@antfu/eslint-config';

export default antfu({
  vue: true,
  astro: true,
  ignores: ['**/.astro/**'],
  stylistic: {
    semi: true,
  },
  rules: {
    // 'vue/multi-word-component-names': 'off',
    // 'vue/no-multiple-template-root': 'off',
    // '@typescript-eslint/no-explicit-any': 'warn',
  },
});
