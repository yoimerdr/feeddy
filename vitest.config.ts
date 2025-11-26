import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        include: ['src/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
    resolve: {
        alias: {
            '@jstls': path.resolve(__dirname, './lib/jstls/src'),
            '@feeddy': path.resolve(__dirname, './src'),
        },
    },
});
