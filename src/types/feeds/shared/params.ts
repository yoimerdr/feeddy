/**
 * The order by options for the feed request.
 */
export type OrderBy = "updated" | "published";

/**
 * The alternative representation type options.
 */
export type Alt = "json" | "rss" | "atom";

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

  /**
   * The alternative representation type.
   */
  alt: Alt;
}
