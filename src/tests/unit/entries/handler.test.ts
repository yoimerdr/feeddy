import { describe, it, expect, vi } from 'vitest';
import { basicHandler, basicHandlerPage } from '@feeddy/entries/handler';

describe('Entries Handler', () => {
    describe('basicHandler', () => {
        it('should create a handler', () => {
            const changePage = vi.fn().mockReturnValue('page-fn');
            const handlerBuilder = basicHandler(changePage);

            const options = {};
            const params = { max: vi.fn().mockReturnValue(10) };
            const builder = { max: vi.fn() };
            const request = vi.fn();

            const handlerFn = handlerBuilder(options as any, params as any, builder as any, request);

            const blog = { feed: { openSearch$totalResults: 100 } };
            const result = handlerFn(blog as any);

            expect(result.total).toBe(100);
            expect(result.page).toBe('page-fn');
            expect(builder.max).toHaveBeenCalledWith(10);
            expect(changePage).toHaveBeenCalledWith(options, params, builder, request);
        });
    });

    describe('basicHandlerPage', () => {
        it('should create a page handler', async () => {
            const feed = { params: {} };
            const params = {};
            const builder = {
                page: vi.fn(),
                repage: vi.fn(),
                build: vi.fn().mockReturnValue({ new: 'params' })
            };
            const request = vi.fn().mockResolvedValue({ feed: { entry: ['entry1'] } });

            const pageHandler = basicHandlerPage(feed as any, params as any, builder as any, request);

            const context = { total: 100 };
            const result = await pageHandler.call(context as any, 2);

            expect(builder.page).toHaveBeenCalledWith(2);
            expect(feed.params).toEqual({ new: 'params' });
            expect(request).toHaveBeenCalledWith(feed);
            expect(result.entries).toEqual(['entry1']);
        });

        it('should handle reverse pagination', async () => {
            const feed = { params: {} };
            const params = {};
            const builder = {
                page: vi.fn(),
                repage: vi.fn(),
                build: vi.fn().mockReturnValue({})
            };
            const request = vi.fn().mockResolvedValue({ feed: { entry: ['entry1', 'entry2'] } });

            const pageHandler = basicHandlerPage(feed as any, params as any, builder as any, request);

            const context = { total: 100 };
            const result = await pageHandler.call(context as any, 2, true);

            expect(builder.repage).toHaveBeenCalledWith(100, 2);
            expect(result.entries).toEqual(['entry2', 'entry1']); // Reversed
        });
    });
});
