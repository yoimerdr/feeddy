import { describe, it, expect } from 'vitest';
import { queryBuilder } from '@feeddy/search/query/builder';

describe('Search Query Builder', () => {
    it('should create an empty builder', () => {
        const builder = queryBuilder();
        expect(builder.build()).toBeUndefined();
    });

    it('should build simple terms', () => {
        const builder = queryBuilder();
        builder.terms('term1', 'term2');
        expect(builder.build()).toBe('term1|term2');
    });

    it('should handle AND operator', () => {
        const builder = queryBuilder();
        builder.and().terms('term1', 'term2');
        expect(builder.build()).toBe('term1 term2');
    });

    it('should handle exact match', () => {
        const builder = queryBuilder();
        builder.exact().terms('term 1');
        expect(builder.build()).toBe('"term 1"');
    });

    it('should handle exclude', () => {
        const builder = queryBuilder();
        builder.exclude().terms('term1');
        expect(builder.build()).toBe('-term1');
    });

    it('should handle named terms', () => {
        const builder = queryBuilder();
        builder.named('label', 'val1', 'val2');
        expect(builder.build()).toBe('label:val1|label:val2');
    });

    it('should handle specific named methods', () => {
        const builder = queryBuilder();
        builder.labels('l1');
        expect(builder.build()).toBe('label:l1');

        builder.clear(true);
        builder.author('a1');
        expect(builder.build()).toBe('author:a1');

        builder.clear(true);
        builder.title('t1');
        expect(builder.build()).toBe('title:t1');

        builder.clear(true);
        builder.link('lnk1');
        expect(builder.build()).toBe('link:lnk1');
    });

    it('should chain methods', () => {
        const builder = queryBuilder();
        builder
            .labels('l1')
            .and()
            .exclude()
            .labels('l2');

        // label:l1 -label:l2
        // Wait, default op is OR.
        // .labels('l1') -> query="label:l1"
        // .and() -> op=" "
        // .exclude() -> xc=true
        // .labels('l2') -> append " -label:l2" using op " "
        // Result: "label:l1 -label:l2"
        expect(builder.build()).toBe('label:l1 -label:l2');
    });

    it('should clear builder', () => {
        const builder = queryBuilder();
        builder.terms('term');
        builder.clear(true);
        expect(builder.build()).toBeUndefined();
    });
});
