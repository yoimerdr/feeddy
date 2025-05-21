import type {ParseableSize} from "@jstls/core/geometry/size/shared";

export type ImageSize<U = string> = {
  /**
   * Width dimension.
   */
  width: U;
  /**
   * Height dimension.
   */
  height: U;
};

/**
 * The operator of a query.
 */
export type QueryOperator = 'OR' | 'AND';

/**
 * The relationship of a link.
 */
export type LinkRel = 'alternate' | 'next' | 'hub' | 'self' | 'edit' | 'replies' | 'http://schemas.google.com/g/2005#feed';

export interface Routes {
  /**
   * The default feed posts route.
   */
  readonly posts: string;

  /**
   * The summary feed posts route.
   */
  readonly postsSummary: string;

  /**
   * The default feed comments route.
   */
  readonly comments: string;

  /**
   * The summary feed comments route.
   */
  readonly commentsSummary: string;

  /**
   * The default feed pages route.
   */
  readonly pages: string;

  /**
   * The summary feed pages route.
   */
  readonly pagesSummary: string;
}


export interface SimpleSize extends ParseableSize, ImageSize<number> {

}
