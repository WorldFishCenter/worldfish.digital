import coreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
    {
        ignores: ['.next/**', 'node_modules/**', 'public/**', 'out/**'],
    },
    ...coreWebVitals,
];

export default eslintConfig;
