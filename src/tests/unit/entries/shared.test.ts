import { describe, it, expect } from 'vitest';
import { entryPathname } from '@feeddy/entries/shared';

describe('Entries Shared', () => {
    describe('entryPathname', () => {
        it('should extract pathname from alternate link', () => {
            const entry = {
                link: [
                    { rel: 'self', href: 'http://example.com/feed' },
                    { rel: 'alternate', href: 'http://example.com/2023/01/post-title.html' }
                ]
            };
            expect(entryPathname(entry as any)).toBe('post-title');
        });

        it('should fallback to title if no alternate link', () => {
            const entry = {
                title: 'Post Title',
                link: []
            };
            expect(entryPathname(entry as any)).toBe('post-title');
        });

        it('should handle string input as title', () => {
            expect(entryPathname('Post Title')).toBe('post-title');
        });

        it('should truncate title if length provided', () => {
            expect(entryPathname('Post Title Long', 4)).toBe('post');
        });
    });
});
