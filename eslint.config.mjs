import { defineConfig, globalIgnores } from 'eslint/config';
import react from 'eslint-config-zakodium/react';
import ts from 'eslint-config-zakodium/ts';

export default defineConfig(globalIgnores(['lib']), ts, react, {
  rules: {
    'react-refresh/only-export-components': 'off',
  },
});
