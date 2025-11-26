import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withCategories } from '@feeddy/posts/related';
import * as feeds from '@feeddy/feeds';
import * as feedsRaw from '@feeddy/feeds/raw';
import * as search from '@feeddy/search';
import * as query from '@feeddy/search/query';

// Mock dependencies
vi.mock('@feeddy/feeds', () => ({
    all: vi.fn()
}));

vi.mock('@feeddy/feeds/raw', () => ({
    feedOptions: vi.fn()
}));

vi.mock('@feeddy/search', () => ({
    builderFrom: vi.fn(),
    paramsFrom: vi.fn()
}));

vi.mock('@feeddy/search/query', () => ({
    queryBuilder: vi.fn()
}));

describe('Posts Related', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should reject if categories are empty', async () => {
        await expect(withCategories({ categories: [] } as any)).rejects.toEqual('The categories are empty.');
    });

    it('should fetch related posts', async () => {
        const mockFeedOptions = { params: {} };
        (feedsRaw.feedOptions as any).mockReturnValue(mockFeedOptions);

        const mockParams = { max: vi.fn().mockReturnValue(5) };
        (search.paramsFrom as any).mockReturnValue(mockParams);

        const mockBuilder = {
            exact: vi.fn().mockReturnThis(),
            or: vi.fn().mockReturnThis(),
            and: vi.fn().mockReturnThis(),
            categories: vi.fn().mockReturnThis(),
            build: vi.fn().mockReturnValue('query'),
            query: vi.fn().mockReturnThis()
        };
        (query.queryBuilder as any).mockReturnValue(mockBuilder);
        (search.builderFrom as any).mockReturnValue(mockBuilder);

        const mockBlog = {
            feed: {
                entry: [
                    { category: ['cat1'], title: 'Post 1' },
                    { category: ['cat2'], title: 'Post 2' }
                ]
            }
        };
        (feeds.all as any).mockResolvedValue(mockBlog);

        const result = await withCategories({ categories: ['cat1'], feed: {} } as any);

        expect(result).toBeDefined();
        expect(result.posts).toBeDefined();
        expect(result.blog).toBeDefined();
        expect(feeds.all).toHaveBeenCalled();
    });
});
