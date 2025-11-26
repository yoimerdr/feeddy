import {describe, it, expect, vi} from 'vitest';
import {postThumbnail, thumbnailSizeExpression} from '@feeddy/posts/converters';
import * as geometry from '@jstls/core/geometry/size/shared';

vi.mock('@jstls/core/geometry/size/shared', () => ({
  parseSize: vi.fn()
}));

describe('Posts Converters', () => {
  describe('postThumbnail', () => {
    it('should replace thumbnail size in url', () => {
      (geometry.parseSize as any).mockReturnValue({width: 100, height: 56});
      const url = 'http://example.com/s72-c/img.jpg';
      const result = postThumbnail(url, 100);

      expect(result).toContain('w100-h56');
      expect(result).toContain('-p-k-no-nu');
      expect(result).not.toContain('s72-c');
    });

    it('should handle object size', () => {
      (geometry.parseSize as any).mockReturnValue({width: 200, height: 200});
      const url = 'http://example.com/s72-c/img.jpg';
      const result = postThumbnail(url, {width: 200, height: 200});
      expect(result).toContain('w200-h200');
    });

    it('should handle legacy match', () => {
      (geometry.parseSize as any).mockReturnValue({width: 100, height: 56});
      const url = 'http://example.com/img.jpg=s72-c';
      const result = postThumbnail(url, 100);
      expect(result).toContain('=w100-h56');
    });

    it('should extract url from object', () => {
      (geometry.parseSize as any).mockReturnValue({width: 100, height: 56});
      const entry = {'media$thumbnail': {url: 'http://example.com/s72-c/img.jpg'}};
      const result = postThumbnail(entry as any, 100);
      expect(result).toContain('w100-h56');
    });
  });

  describe('thumbnailSizeExpression', () => {
    it('should be s72-c', () => {
      expect(thumbnailSizeExpression).toBe('s72-c');
    });
  });
});
