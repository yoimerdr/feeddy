import { describe, it, expect, vi, beforeEach } from 'vitest';
import { all, get, byId } from '@feeddy/feeds/index';
import * as raw from '@feeddy/feeds/raw';

// Mock the raw module
vi.mock('@feeddy/feeds/raw', () => ({
  rawAll: vi.fn(),
  rawGet: vi.fn(),
  rawById: vi.fn(),
}));

describe('Feeds Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all feeds and convert them', async () => {
    const mockRawResult = {
      feed: {
        entry: [
          {
            id: { $t: 'post-1' },
            title: { $t: 'Post 1' },
            published: { $t: '2023-01-01T00:00:00Z' },
            updated: { $t: '2023-01-02T00:00:00Z' },
            link: [],
            author: [{ name: { $t: 'Author' } }],
          },
        ],
      },
    };

    (raw.rawAll as any).mockResolvedValue(mockRawResult);

    const result = await all({ type: 'posts' });
    expect(raw.rawAll).toHaveBeenCalledWith({ type: 'posts' });
    expect(result).toBeDefined();
    // Verify conversion happened (checking basic structure)
    expect(result.feed.entry).toHaveLength(1);
    expect(result.feed.entry[0].id).toBe('post-1');
    expect(result.feed.entry[0].title).toBe('Post 1');
  });

  it('should fetch a single feed page and convert it', async () => {
    const mockRawResult = {
      feed: {
        entry: [
          {
            id: { $t: 'post-2' },
            title: { $t: 'Post 2' },
            published: { $t: '2023-01-03T00:00:00Z' },
            updated: { $t: '2023-01-04T00:00:00Z' },
            link: [],
            author: [{ name: { $t: 'Author' } }],
          },
        ],
      },
    };

    (raw.rawGet as any).mockResolvedValue(mockRawResult);

    const result = await get({ type: 'posts', params: { "max-results": 5 } });

    expect(raw.rawGet).toHaveBeenCalledWith({ type: 'posts', params: { "max-results": 5 } });
    expect(result.feed.entry).toHaveLength(1);
    expect(result.feed.entry[0].id).toBe('post-2');
  });

  it('should fetch by id and convert it', async () => {
    const mockRawResult = {
      entry: {
        id: { $t: 'post-3' },
        title: { $t: 'Post 3' },
        published: { $t: '2023-01-05T00:00:00Z' },
        updated: { $t: '2023-01-06T00:00:00Z' },
        link: [],
        author: [{ name: { $t: 'Author' } }],
        content: { $t: 'Content' },
      },
    };

    (raw.rawById as any).mockResolvedValue(mockRawResult);

    const result = await byId({ id: 'post-3', feed: { type: 'posts' } });

    expect(raw.rawById).toHaveBeenCalledWith({ id: 'post-3', feed: { type: 'posts' } });
    expect(result.entry.id).toBe('post-3');
    expect(result.entry.title).toBe('Post 3');
  });
});
