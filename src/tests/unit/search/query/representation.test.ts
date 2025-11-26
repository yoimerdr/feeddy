import { describe, it, expect } from 'vitest';
import { operator, quote, exclude } from '@feeddy/search/query/representation';

describe('Search Query Representation', () => {
    describe('operator', () => {
        it('should return | for OR', () => {
            expect(operator('OR')).toBe('|');
        });

        it('should return space for AND', () => {
            expect(operator('AND')).toBe(' ');
        });

        it('should default to space (AND) for others', () => {
            expect(operator(null)).toBe(' ');
            expect(operator('invalid')).toBe(' ');
        });
    });

    describe('quote', () => {
        it('should return " for exact true', () => {
            expect(quote(true)).toBe('"');
        });

        it('should return empty string for exact false', () => {
            expect(quote(false)).toBe('');
        });

        it('should return empty string for undefined/null', () => {
            expect(quote(undefined)).toBe('');
            expect(quote(null)).toBe('');
        });
    });

    describe('exclude', () => {
        it('should return -', () => {
            expect(exclude()).toBe('-');
        });
    });
});
