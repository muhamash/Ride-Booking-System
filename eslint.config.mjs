// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    // tseslint.configs.recommended,
    {
        rules: {
            "no-console": "warn",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error"
        }
    }
);