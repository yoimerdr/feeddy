import { describe, it, expect, vi, beforeEach } from 'vitest';
import { entriesBase } from '@feeddy/entries/base';
import * as feeds from '@feeddy/feeds';
import * as feedsRaw from '@feeddy/feeds/raw';
import * as search from '@feeddy/search';
import * as shared from '@feeddy/shared';
import * as converters from '@feeddy/shared/converters';

// Mock dependencies
vi.mock('@feeddy/feeds', () => ({
    all: vi.fn(),
    get: vi.fn()
}));

vi.mock('@feeddy/feeds/raw', () => ({
    _rawGet: vi.fn()
}));

vi.mock('@feeddy/search', () => ({
    builderFrom: vi.fn(),
    paramsFrom: vi.fn()
}));

vi.mock('@feeddy/shared', () => ({
    isComments: vi.fn()
}));

vi.mock('@feeddy/shared/converters', () => ({
    rawBlogToBlog: vi.fn()
}));

describe('Entries Base', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize feed and params', async () => {
        const options = { feed: { params: {} } };
        const mockParams = { query: vi.fn(), max: vi.fn() };
        (search.paramsFrom as any).mockReturnValue(mockParams);
        (search.builderFrom as any).mockReturnValue({});
        (feeds.get as any).mockResolvedValue({});

        const builder = vi.fn().mockReturnValue(() => ({}));

        await entriesBase(options as any, builder);

        expect(search.paramsFrom).toHaveBeenCalled();
        expect(search.builderFrom).toHaveBeenCalled();
        expect(builder).toHaveBeenCalled();
    });

    it('should use all if query is present', async () => {
        const options = { feed: { params: {} } };
        const mockParams = { query: vi.fn().mockReturnValue('query'), max: vi.fn() };
        (search.paramsFrom as any).mockReturnValue(mockParams);
        (search.builderFrom as any).mockReturnValue({});
        (feeds.all as any).mockResolvedValue({});

        const builder = vi.fn().mockReturnValue(() => ({}));

        await entriesBase(options as any, builder);

        expect(feeds.all).toHaveBeenCalled();
    });

    it('should handle comments with id', async () => {
        const options = { feed: { params: {} } };
        const mockParams = { query: vi.fn(), max: vi.fn() };
        (search.paramsFrom as any).mockReturnValue(mockParams);
        (search.builderFrom as any).mockReturnValue({});
        (shared.isComments as any).mockReturnValue(true);
        (feedsRaw._rawGet as any).mockResolvedValue({});
        (converters.rawBlogToBlog as any).mockReturnValue({});

        const builder = vi.fn().mockReturnValue(() => ({}));

        await entriesBase(options as any, builder, '123');

        expect(feedsRaw._rawGet).toHaveBeenCalled();
        expect(converters.rawBlogToBlog).toHaveBeenCalled();
    });
});
