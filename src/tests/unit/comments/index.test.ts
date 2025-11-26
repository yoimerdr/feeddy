import { describe, it, expect, vi, beforeEach } from 'vitest';
import { commentsById } from '@feeddy/comments';
import * as entriesBaseModule from '@feeddy/entries/base';
import * as entriesHandlerModule from '@feeddy/entries/handler';

// Mock dependencies
vi.mock('@feeddy/entries/base', () => ({
    entriesBase: vi.fn()
}));

vi.mock('@feeddy/entries/handler', () => ({
    basicHandler: vi.fn(),
    basicHandlerPage: vi.fn()
}));

describe('Comments', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('commentsById', () => {
        it('should call entriesBase with comments type', async () => {
            const options = { feed: {}, id: '123' };
            (entriesBaseModule.entriesBase as any).mockResolvedValue('handler');
            (entriesHandlerModule.basicHandler as any).mockReturnValue('handlerFn');

            const result = await commentsById(options as any);

            expect(options.feed).toHaveProperty('type', 'comments');
            expect(entriesBaseModule.entriesBase).toHaveBeenCalledWith(options, 'handlerFn', '123');
            expect(result).toBe('handler');
        });
    });
});
