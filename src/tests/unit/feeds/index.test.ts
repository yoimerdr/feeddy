import { describe, it, expect, vi, beforeEach } from 'vitest';
import { all, get, byId } from '@feeddy/feeds';
import * as feedsRaw from '@feeddy/feeds/raw';
import * as converters from '@feeddy/shared/converters';
import * as shared from '@feeddy/shared';

// Mock dependencies
vi.mock('@feeddy/feeds/raw', () => ({
    rawAll: vi.fn(),
    rawGet: vi.fn(),
    rawById: vi.fn()
}));

vi.mock('@feeddy/shared/converters', () => ({
    rawBlogToBlog: vi.fn(),
    rawBlogEntryToBlogEntry: vi.fn()
}));

vi.mock('@feeddy/shared', () => ({
    isComments: vi.fn()
}));

describe('Feeds', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('all', () => {
        it('should call rawAll and convert', async () => {
            const options = {};
            (feedsRaw.rawAll as any).mockResolvedValue('raw');
            (converters.rawBlogToBlog as any).mockReturnValue('converted');

            const result = await all(options as any);

            expect(feedsRaw.rawAll).toHaveBeenCalledWith(options);
            expect(converters.rawBlogToBlog).toHaveBeenCalledWith('raw');
            expect(result).toBe('converted');
        });
    });

    describe('get', () => {
        it('should call rawGet and convert', async () => {
            const options = {};
            (feedsRaw.rawGet as any).mockResolvedValue('raw');
            (converters.rawBlogToBlog as any).mockReturnValue('converted');

            const result = await get(options as any);

            expect(feedsRaw.rawGet).toHaveBeenCalledWith(options);
            expect(converters.rawBlogToBlog).toHaveBeenCalledWith('raw');
            expect(result).toBe('converted');
        });
    });

    describe('byId', () => {
        it('should call rawById and convert (not comments)', async () => {
            const options = { feed: {} };
            (feedsRaw.rawById as any).mockResolvedValue('raw');
            (converters.rawBlogEntryToBlogEntry as any).mockReturnValue('converted');
            (shared.isComments as any).mockReturnValue(false);

            const result = await byId(options as any);

            expect(feedsRaw.rawById).toHaveBeenCalledWith(options);
            expect(converters.rawBlogEntryToBlogEntry).toHaveBeenCalledWith('raw');
            expect(result).toBe('converted');
        });

        it('should call rawById and convert (comments)', async () => {
            const options = { feed: {} };
            (feedsRaw.rawById as any).mockResolvedValue('raw');
            (converters.rawBlogToBlog as any).mockReturnValue('converted');
            (shared.isComments as any).mockReturnValue(true);

            const result = await byId(options as any);

            expect(feedsRaw.rawById).toHaveBeenCalledWith(options);
            expect(converters.rawBlogToBlog).toHaveBeenCalledWith('raw');
            expect(result).toBe('converted');
        });
    });
});
