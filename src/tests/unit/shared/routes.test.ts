import { describe, it, expect } from 'vitest';
import { createRoute, routes } from '@feeddy/shared/routes';

describe('Shared Routes', () => {
    describe('createRoute', () => {
        it('should create posts full route', () => {
            expect(createRoute('posts', 'full')).toBe('feeds/posts/full');
        });

        it('should create posts summary route', () => {
            expect(createRoute('posts', 'summary')).toBe('feeds/posts/summary');
        });

        it('should create pages full route', () => {
            expect(createRoute('pages', 'full')).toBe('feeds/pages/full');
        });

        it('should create comments full route', () => {
            expect(createRoute('comments', 'full')).toBe('feeds/comments/full');
        });

        it('should create comments route with id', () => {
            expect(createRoute('comments', 'full', '123')).toBe('feeds/123/comments/full');
        });

        it('should create posts route with id (not comments)', () => {
            expect(createRoute('posts', 'full', '123')).toBe('feeds/posts/full/123');
        });
    });

    describe('routes constant', () => {
        it('should have predefined routes', () => {
            expect(routes.posts).toBe('feeds/posts/full');
            expect(routes.postsSummary).toBe('feeds/posts/summary');
            expect(routes.pages).toBe('feeds/pages/full');
            expect(routes.pagesSummary).toBe('feeds/pages/summary');
            expect(routes.comments).toBe('feeds/comments/full');
            expect(routes.commentsSummary).toBe('feeds/comments/summary');
        });
    });
});
