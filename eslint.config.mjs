import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'next-env.d.ts',
      '.aistudio/**',
      'pixel-store-visual-review/**',
      'pixel-store-post-fix-review/**',
    ],
  },
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
];

export default eslintConfig;
