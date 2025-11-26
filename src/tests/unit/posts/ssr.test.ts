import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ssrPosts } from '@feeddy/posts/ssr';
import * as entriesBaseModule from '@feeddy/entries/base';
import * as entriesHandlerModule from '@feeddy/entries/handler';

// Mock dependencies
vi.mock('@feeddy/entries/base', () => ({
    entriesBase: vi.fn()
}));

vi.mock('@feeddy/entries/handler', () => ({
    basicHandler: vi.fn()
}));

describe('Posts SSR', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call entriesBase with correct options', async () => {
        const options = { feed: { params: {} }, ssr: 'default' };
        (entriesBaseModule.entriesBase as any).mockImplementation((opts, handler) => {
            return Promise.resolve({ opts, handler });
        });
        (entriesHandlerModule.basicHandler as any).mockImplementation((fn) => fn);

        await ssrPosts(options as any);

        expect(entriesBaseModule.entriesBase).toHaveBeenCalled();
        const callArgs = (entriesBaseModule.entriesBase as any).mock.calls[0];
        expect(callArgs[0]).toBe(options);
    });

    it('should handle label ssr', async () => {
        const options = { feed: { params: {} }, ssr: 'label', category: 'test-label' };
        (entriesBaseModule.entriesBase as any).mockImplementation((opts, handler) => {
            return Promise.resolve({ opts, handler });
        });

        await ssrPosts(options as any);

        expect(options.feed.params).toHaveProperty('q'); // Query should be set
    });
});
