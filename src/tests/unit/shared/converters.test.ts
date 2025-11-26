import { describe, it, expect } from 'vitest';
import {
    rawTextToText,
    rawTextToNumber,
    rawTextToBoolean,
    rawCategoryToCategory,
    rawCategoriesToCategories,
    rawAuthorToAuthor,
    rawAuthorsToAuthors,
    rawEntryToEntry,
    rawFeedToFeed,
} from '@feeddy/shared/converters';
import {RawPostEntry} from "@feeddy/types/feeds/raw/posts";
import {PostEntry} from "@feeddy/types/feeds/posts";
import {RawAuthor} from "@feeddy/types/feeds/raw/author";
import {RawBaseFeed} from "@feeddy/types/feeds/raw/entry";
import {BaseFeed} from "@feeddy/types/feeds/entry";

describe('Shared Converters', () => {
    describe('rawTextToText', () => {
        it('should convert raw text object to simple text', () => {
            const raw = { $t: 'hello' };
            expect(rawTextToText(raw)).toBe('hello');
        });

        it('should handle empty text', () => {
            const raw = { $t: '' };
            expect(rawTextToText(raw)).toBe('');
        });
    });

    describe('rawTextToNumber', () => {
        it('should convert raw text object to number', () => {
            const raw = { $t: '123' };
            expect(rawTextToNumber(raw)).toBe(123);
        });

        it('should handle invalid number', () => {
            const raw = { $t: 'abc' };
            expect(rawTextToNumber(raw)).toBeNull();
        });
    });

    describe('rawTextToBoolean', () => {
        it('should convert raw text object to boolean', () => {
            expect(rawTextToBoolean({ $t: 'true' })).toBe(true);
            expect(rawTextToBoolean({ $t: 'false' })).toBe(true); // Boolean('false') is true
            expect(rawTextToBoolean({ $t: '' })).toBe(false);
        });
    });

    describe('rawCategoryToCategory', () => {
        it('should convert raw category to category term', () => {
            const raw = { term: 'cat1', scheme: 'scheme' };
            expect(rawCategoryToCategory(raw)).toBe('cat1');
        });
    });

    describe('rawCategoriesToCategories', () => {
        it('should convert array of raw categories', () => {
            const raw = [{ term: 'cat1' }, { term: 'cat2' }];
            expect(rawCategoriesToCategories(raw as any)).toEqual(['cat1', 'cat2']);
        });

        it('should return empty array if input is not array', () => {
            expect(rawCategoriesToCategories(null as any)).toEqual([]);
        });
    });

    describe('rawAuthorToAuthor', () => {
        it('should convert raw author', () => {
            const raw = {
                name: { $t: 'John' },
                email: { $t: 'john@example.com' },
                uri: { $t: 'http://example.com' },
                gd$image: { src: 'img.jpg' }
            };
            const expected = {
                name: 'John',
                email: 'john@example.com',
                uri: 'http://example.com',
                gd$image: { src: 'img.jpg' }
            };
            expect(rawAuthorToAuthor(raw as any)).toEqual(expected);
        });
    });

    describe('rawAuthorsToAuthors', () => {
        it('should convert array of raw authors', () => {
            const raw = [{ name: { $t: 'John' } }];
            expect(rawAuthorsToAuthors(raw as any)).toHaveLength(1);
            expect(rawAuthorsToAuthors(raw as any)[0].name).toBe('John');
        });

        it('should return empty array if input is not array', () => {
            expect(rawAuthorsToAuthors(null as any)).toEqual([]);
        });
    });

    describe('rawEntryToEntry', () => {
        it('should convert raw entry', () => {
            const raw = {
                id: { $t: '1' },
                title: { $t: 'Title', type: "text" },
                updated: { $t: '2023-01-01' },
                published: { $t: '2023-01-01' },
                content: { $t: 'Content', type: "html" },
                summary: { $t: 'Summary' } ,
                link: [],
                author: [{ name: { $t: 'Author' } } as RawAuthor],
                category: [{ term: 'Cat', schema: "" }],
                'media$thumbnail': { url: 'img.jpg', width: '100', height: '100' },
                'thr$total': { $t: '5' }
            };

            const result = rawEntryToEntry<RawPostEntry, PostEntry>(raw as RawPostEntry);

            expect(result.id).toBe('1');
            expect(result.title).toBe('Title');
            expect(result.updated).toBe('2023-01-01');
            expect(result.content).toBe('Content');
            expect((result as any).summary).toBe('Summary');
            expect(result.author).toHaveLength(1);
            expect(result.category).toEqual(['Cat']);
            expect(result.media$thumbnail).toEqual({ url: 'img.jpg', width: 100, height: 100 });
            expect(result.thr$total).toBe(5);
        });

        it('should return empty object if input is not object', () => {
            expect(rawEntryToEntry(null as any)).toEqual({});
        });
    });

    // rawBlogEntryToBlogEntry and rawFeedToFeed tests would be similar,
    // relying on rawEntryToEntry and adding specific fields.

    describe('rawFeedToFeed', () => {
        it('should convert raw feed', () => {
            const raw = {
                id: { $t: 'feed1' },
                title: { $t: 'Feed Title' },
                subtitle: { $t: 'Subtitle' },
                'openSearch$totalResults': { $t: '10' },
                entry: [{ id: { $t: 'entry1' } }]
            };

            const result = rawFeedToFeed<RawBaseFeed, BaseFeed<any>>(raw as RawBaseFeed);

            expect(result.id).toBe('feed1');
            expect(result.title).toBe('Feed Title');
            expect(result.subtitle).toBe('Subtitle');
            expect(result.openSearch$totalResults).toBe(10);
            expect(result.entry).toHaveLength(1);
        });
    });
});
