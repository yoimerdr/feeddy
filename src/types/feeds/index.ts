import {
  FeedByIdOptions,
  FeedByIdOptionsSummary,
  FeedOptions,
  FeedOptionsSummary,
  FeedResult,
  FeedRoute,
  FeedType
} from "./options";
import {RawFeed} from "./raw";
import {PostsBlog, PostsBlogSummary, PostsEntryBlog, PostsEntryBlogSummary} from "./posts";
import {CommentsBlog, CommentsBlogSummary} from "./comments";
import {PagesBlogSummary, PagesEntryBlog, PagesEntryBlogSummary} from "./pages";

/**
 * Represents the result type for feed requests, mapping feed types and routes to their corresponding blog types.
 *
 * @template T - The feed type (posts, comments, or pages)
 * @template R - The feed route (summary or default)
 */
export type Result<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute, > =
  FeedResult<T, R,
    PostsBlogSummary, CommentsBlogSummary, PagesBlogSummary,
    PostsBlog, CommentsBlog, PostsBlog>

/**
 * Represents the result type for feed-by-ID requests, mapping feed types and routes to their corresponding blog entry types.
 *
 * @template T - The feed type (posts, comments, or pages)
 * @template R - The feed route (summary or default)
 */
export type ByIdResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> =
  FeedResult<T, R,
    PostsEntryBlogSummary, CommentsBlogSummary, PagesEntryBlogSummary,
    PostsEntryBlog, CommentsBlog, PagesEntryBlog>

/**
 * Interface defining methods for interacting with mapped Blogger feeds.
 *
 * Provides functionality to fetch both summary and full content feeds,
 * with options for single entries or complete feed retrieval.
 *
 */
export interface Feed {
  /**
   * Fetches a summary feed.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options for the feed request
   */<T extends FeedType = FeedType, >(options: FeedOptionsSummary<T>): Promise<Result<T, "summary">>;

  /**
   * Fetches a feed with full content.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   */<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<Result<T, R>>;

  /**
   * Recursively fetches all entries from a summary feed.
   *
   * Makes multiple API requests as needed to retrieve the complete dataset.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options for the feed request
   * @remarks The returned JSON represents the last request's data with accumulated entries
   */
  all<T extends FeedType = FeedType, >(options: FeedOptionsSummary<T>): Promise<Result<T, "summary">>;

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
  all<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<Result<T, R>>;

  /**
   * Fetches a single entry by ID with full content.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options including the entry ID
   * @since 1.2
   */
  byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<ByIdResult<T, R>>;

  /**
   * Fetches a single entry by ID with summary content.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options including the entry ID
   * @since 1.2
   */
  byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<ByIdResult<T, "summary">>;

  /**
   * The handler to make requests to the blogger feed API directly.
   */
  readonly raw: RawFeed
}
