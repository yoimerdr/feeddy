import {RawPostsBlog, RawPostsBlogSummary, RawPostsEntryBlog, RawPostsEntryBlogSummary} from "./posts";
import {RawCommentsBlog, RawCommentsBlogSummary} from "./comments";
import {RawPagesBlog, RawPagesBlogSummary, RawPagesEntryBlog, RawPagesEntryBlogSummary} from "./pages";
import {
  FeedByIdOptions,
  FeedByIdOptionsSummary,
  FeedOptions,
  FeedOptionsSummary,
  FeedResult,
  FeedRoute,
  FeedType
} from "../options";

/**
 * Represents the result type for raw feed requests, mapping feed types and routes to their corresponding blog types.
 *
 * @template T - The feed type (posts, comments, or pages)
 * @template R - The feed route (summary or default)
 */
export type RawResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> =
  FeedResult<T, R,
    RawPostsBlogSummary, RawCommentsBlogSummary, RawPagesBlogSummary,
    RawPostsBlog, RawCommentsBlog, RawPagesBlog>;

/**
 * Represents the result type for raw feed-by-ID requests, mapping feed types and routes to their corresponding blog entry types.
 *
 * @template T - The feed type (posts, comments, or pages)
 * @template R - The feed route (summary or default)
 */
export type RawByIdResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> =
  FeedResult<T, R,
    RawPostsEntryBlogSummary,
    RawCommentsBlogSummary,
    RawPagesEntryBlogSummary,
    RawPostsEntryBlog,
    RawCommentsBlog,
    RawPagesEntryBlog>

/**
 * Interface defining methods for interacting with raw Blogger feeds.
 *
 * Provides functionality to fetch both summary and full content feeds,
 * with options for single entries or complete feed retrieval.
 */
export interface RawFeed {

  /**
   * Fetches a summary feed.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options for the feed request
   */<T extends FeedType = FeedType, >(options: FeedOptionsSummary<T>): Promise<RawResult<T, "summary">>;

  /**
   * Fetches a feed with full content.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   */<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<RawResult<T, R>>;

  /**
   * Recursively fetches all entries from a summary feed.
   *
   * Makes multiple API requests as needed to retrieve the complete dataset.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options for the feed request
   * @remarks The returned JSON represents the last request's data with accumulated entries
   */
  all<T extends FeedType = FeedType, >(options: FeedOptionsSummary<T>): Promise<RawResult<T, "summary">>;

  /**
   * Recursively fetches all entries from a full content feed.
   *
   * Makes multiple API requests as needed to retrieve the complete dataset.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   * @remarks The returned JSON represents the last request's data with accumulated entries
   */
  all<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<RawResult<T, R>>;

  /**
   * Fetches a single entry by ID with full content.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options including the entry ID
   * @since 1.2
   */
  byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<RawByIdResult<T, R>>;

  /**
   * Fetches a single entry by ID with summary content.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options including the entry ID
   * @since 1.2
   */
  byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<RawByIdResult<T, "summary">>;
}

export {RawWithSummary} from "./entry";
export {RawWithContent} from "./entry";
