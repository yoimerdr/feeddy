import { describe, it, expect } from 'vitest';
import { paramsBuilder } from '@feeddy/search/params/builder';

describe('SearchParamsBuilder', () => {
  it('should create an empty builder', () => {
    const builder = paramsBuilder();
    expect(builder).toBeDefined();
    expect(builder.build()).toEqual({});
  });

  it('should set max results', () => {
    const builder = paramsBuilder();
    builder.max(10);
    expect(builder.build()).toEqual({ 'max-results': 10 });
  });

  it('should set start index', () => {
    const builder = paramsBuilder();
    builder.start(5);
    expect(builder.build()).toEqual({ 'start-index': 5 });
  });

  it('should chain methods', () => {
    const builder = paramsBuilder();
    builder.max(10).start(5);
    expect(builder.build()).toEqual({ 'max-results': 10, 'start-index': 5 });
  });

  it('should handle aliases', () => {
    const builder = paramsBuilder();
    builder.limit(20).index(15);
    expect(builder.build()).toEqual({ 'max-results': 20, 'start-index': 15 });
  });

  it('should handle pagination (page)', () => {
    const builder = paramsBuilder();
    builder.max(10).page(2);
    // page 2 with max 10 means start index 11 (1-based)
    // (2 - 1) * 10 + 1 = 11
    expect(builder.build()).toEqual({ 'max-results': 10, 'start-index': 11 });
  });

  it('should handle repagination (repage)', () => {
    const builder = paramsBuilder();
    // Total 24, page 2, max 10
    // This logic is complex in the source, let's verify standard behavior
    // Based on source:
    // mx = 10
    // index = coerceAtLeast(1, 24 - (2 * 10) + 1) = 24 - 20 + 1 = 5
    // prevIndex = 10 (since page > 1)
    // prevIndex = coerceAtLeast(1, (24 - ((2-1)*10) + 1 - 5)) = 24 - 10 + 1 - 5 = 10

    builder.max(10).repage(24, 2);
    expect(builder.build()).toEqual({ 'max-results': 10, 'start-index': 5 });
  });

  it('should set query', () => {
    const builder = paramsBuilder();
    builder.query('test query');
    expect(builder.build()).toEqual({ q: 'test query' });
  });

  it('should set date bounds', () => {
    const builder = paramsBuilder(),
      maxDate = new Date(Date.now()),
      minDate = new Date(Date.now());
    minDate.setDate(maxDate.getDate() - 7);

    const min = minDate.toISOString(),
      max = maxDate.toISOString();

    builder.published(min, max);
    expect(builder.build()).toEqual({
      'published-min': min,
      'published-max': max
    });
  });

  it('should clear parameters', () => {
    const builder = paramsBuilder();
    builder.max(10).start(5);
    builder.clear();
    expect(builder.build()).toEqual({});
  });
});
