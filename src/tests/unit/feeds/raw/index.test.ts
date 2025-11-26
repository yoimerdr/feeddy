import {describe, it, expect, vi, beforeEach} from 'vitest';
import {_rawGet, feedOptions} from '@feeddy/feeds/raw';

// Mock dependencies
vi.mock('@feeddy/shared', () => ({
  buildUrl: vi.fn().mockReturnValue('http://example.com/feed'),
  isComments: vi.fn().mockReturnValue(false),
  getId: vi.fn()
}));

// Mock fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('Feeds Raw', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('feedOptions', () => {
    it('should set default options', () => {
      const result = feedOptions({});
      expect(result.route).toBe('summary');
      expect(result.type).toBe('posts');
      expect(result.params).toHaveProperty('max-results', 1);
    });

    it('should merge params', () => {
      const result = feedOptions({params: {q: 'test'}});
      expect(result.params).toHaveProperty('q', 'test');
      expect(result.params).toHaveProperty('max-results', 1);
    });
  });

  describe('_rawGet', () => {
    it('should fetch and return blog', async () => {
      const mockBlog = {
        feed: {
          entry: [],
          openSearch$itemsPerPage: {$t: "0"},
          openSearch$totalResults: {$t: "0"},
          openSearch$startIndex: {$t: "1"},
        }
      };
      fetchMock.mockResolvedValue({
        status: 200,
        text: () => Promise.resolve(JSON.stringify(mockBlog))
      });

      const result = await _rawGet({});
      expect(fetchMock).toHaveBeenCalledWith('http://example.com/feed');
      expect(result).toEqual(mockBlog);
    });

    it('should throw on non-200 status', async () => {
      fetchMock.mockResolvedValue({
        status: 404
      });

      await expect(_rawGet({})).rejects.toThrow('Request failed. Status: 404');
    });

    it('should throw on invalid JSON', async () => {
      fetchMock.mockResolvedValue({
        status: 200,
        text: () => Promise.resolve('invalid json')
      });

      await expect(_rawGet({})).rejects.toHaveProperty('message', 'Parse failed. The response is not a JSON.');
    });

    it('should handle pagination (all=true)', async () => {
      // First response has 2 entries, max is default (which is overridden to maxResults in _rawGet for all=true)
      // Wait, _rawGet sets max to maxResults (imported from search) if all=true.
      // I need to mock maxResults from search if I want to control it, or assume it's large.
      // The logic:
      // if (isNotEmpty(entry) && (all || (!all && length < max)))
      //   recurse

      const entry1 = [{id: '1'}];
      const entry2 = [{id: '2'}];

      fetchMock
        .mockResolvedValueOnce({
          status: 200,
          text: () => Promise.resolve(JSON.stringify({
            feed: {
              entry: entry1,
              openSearch$totalResults: {$t: '2'},
              openSearch$itemsPerPage: {$t: '2'},
              openSearch$startIndex: {$t: '1'},
            }
          }))
        })
        .mockResolvedValueOnce({
          status: 200,
          text: () => Promise.resolve(JSON.stringify({
            feed: {
              entry: entry2,
              openSearch$totalResults: {$t: '2'},
              openSearch$itemsPerPage: {$t: '2'},
              openSearch$startIndex: {$t: '1'},
            }
          }))
        })
        .mockResolvedValueOnce({
          status: 200,
          text: () => Promise.resolve(JSON.stringify({
            feed: {
              entry: [],
              openSearch$totalResults: {$t: '2'},
              openSearch$itemsPerPage: {$t: '2'},
              openSearch$startIndex: {$t: '1'},
            }
          }))
        });

      // We need to mock maxResults to be small to force multiple requests?
      // Or just rely on the loop condition.
      // The loop condition: `isNotEmpty(entry)`.
      // So if it returns entries, it continues?
      // `if (isNotEmpty(entry) && (all || (!all && length < max)))`

      // If all=true, it continues as long as entry is not empty.

      const result = await _rawGet({}, true);

      expect(fetchMock).toHaveBeenCalledTimes(3); // 1st batch, 2nd batch, 3rd empty batch
      expect(result.feed.entry).toHaveLength(2);
    });
  });
});
