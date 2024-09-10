/**
 * The route options of the blog's feed.
 */
export type FeedRoute = 'summary' | "full";

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
export type LinkRel = 'alternate' | 'next' | 'hub' | 'self' | 'edit' | 'http://schemas.google.com/g/2005#feed'

export interface FeedOptions {

  /**
   * The blog's URL.
   */
  blogUrl: string;

  /**
   * The route of the blog's feed.
   *
   * The possible values are 'full' or 'summary'.
   */
  route: FeedRoute;

  /**
   * The parameters for the feed request.
   */
  params: Partial<RequestFeedParams>;
}

export interface FeedOptionsSummary extends FeedOptions {

  /**
   * The summary route of the blog's feed.
   */
  route: 'summary';
}

export interface FeedOptionsFull extends FeedOptions {

  /**
   * The full route of the blog's feed.
   */
  route: 'full';
}

export interface Routes {

  /**
   * The pathname for the summary posts feed.
   */
  postsSummary(): string;

  /**
   * The pathname for the <b>default</b> posts feed.
   */
  posts(): string;
}

/**
 * The order by options for the feed request.
 */
export type OrderBy = "lastmodified" | "starttime" | "updated";


export interface RequestFeedParams {

  /**
   * The maximum number of results to be retrieved.
   */
  "max-results": string | number;

  /**
   * The 1-based index of the first result to be retrieved.
   */
  "start-index": string | number;

  /**
   * The inclusive min bound on the entry publication date.
   */
  "published-min": string;

  /**
   * The exclusive max bound on the entry publication date.
   */
  "published-max": string;

  /**
   * The inclusive min bound on the entry update date.
   */
  "updated-min": string;

  /**
   * The exclusive min bound on the entry update date.
   */
  "updated-max": string;

  /**
   * The sort order applied to results.
   */
  orderby: OrderBy;
  
  /**
   * The full-text query string.
   */
  q: string;
}
