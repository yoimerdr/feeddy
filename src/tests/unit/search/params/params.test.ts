import { describe, it, expect } from 'vitest';
import { SearchParams, paramsFrom } from '@feeddy/search/params/params';

describe('SearchParams', () => {
    it('should create an empty params object', () => {
        const params = new SearchParams();
        expect(params.source).toEqual({});
    });

    it('should set and get max results', () => {
        const params = new SearchParams();
        params.max(10);
        expect(params.max()).toBe(10);
        expect(params.source['max-results']).toBe(10);
    });

    it('should set and get start index', () => {
        const params = new SearchParams();
        params.start(5);
        expect(params.start()).toBe(5);
        expect(params.source['start-index']).toBe(5);
    });

    it('should set and get query', () => {
        const params = new SearchParams();
        params.query('test');
        expect(params.query()).toBe('test');
        expect(params.source.q).toBe('test');
    });

    it('should set and get orderby', () => {
        const params = new SearchParams();
        params.orderby('published');
        expect(params.orderby()).toBe('published');
        expect(params.source.orderby).toBe('published');
    });

    it('should default orderby to updated if invalid', () => {
        const params = new SearchParams();
        // @ts-ignore
        params.orderby('invalid');
        expect(params.orderby()).toBe('updated');
    });

    it('should set and get alt', () => {
        const params = new SearchParams();
        params.alt('rss');
        expect(params.alt()).toBe('rss');
        expect(params.source.alt).toBe('rss');
    });

    it('should default alt to json if invalid', () => {
        const params = new SearchParams();
        // @ts-ignore
        params.alt('invalid');
        expect(params.alt()).toBe('json');
    });

    it('should set and get date bounds', () => {
        const params = new SearchParams();
        const date = '2023-01-01T00:00:00.000Z';

        params.publishedAtLeast(date);
        expect(params.publishedAtLeast()).toBe(date);
        expect(params.source['published-min']).toBe(date);

        params.publishedAtMost(date);
        expect(params.publishedAtMost()).toBe(date);
        expect(params.source['published-max']).toBe(date);

        params.updatedAtLeast(date);
        expect(params.updatedAtLeast()).toBe(date);
        expect(params.source['updated-min']).toBe(date);

        params.updatedAtMost(date);
        expect(params.updatedAtMost()).toBe(date);
        expect(params.source['updated-max']).toBe(date);
    });

    it('should create from existing params', () => {
        const source = { 'max-results': 5, q: 'test' };
        const params = paramsFrom(source);
        expect(params.max()).toBe(5);
        expect(params.query()).toBe('test');
    });

    it('should copy params', () => {
        const source = { 'max-results': 5 };
        const params1 = paramsFrom(source);
        const params2 = paramsFrom(params1, true);

        params2.max(10);
        expect(params1.max()).toBe(5);
        expect(params2.max()).toBe(10);
    });

    it('should return defined params', () => {
        const params = new SearchParams();
        params.max(10);
        params.query(undefined as any); // Simulate undefined

        const defined = params.toDefined();
        expect(defined).toEqual({ 'max-results': 10 });
        expect(defined).not.toHaveProperty('q');
    });
});
