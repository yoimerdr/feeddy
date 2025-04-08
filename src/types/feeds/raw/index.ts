import {
  RawByIdPostResult, RawByIdPostResultSummary,
  RawPostsBlog,
  RawPostsBlogSummary,
  RawPostsEntryBlog,
  RawPostsEntryBlogSummary,
  RawPostsResult,
  RawPostsResultSummary
} from "./posts";
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
import {ByIdPostsOptions, ByIdPostsOptionsSummary, PostsFeedOptions, PostsFeedOptionsSummary} from "../../posts";

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
   * Fetches a post's feed with full content.
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions<R>): Promise<RawPostsResult<R>>;

  /**
   * Fetches a summary post's feed.
   *
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  (options: PostsFeedOptionsSummary): Promise<RawPostsResultSummary>;

  /**
   * Recursively fetches all entries from a summary feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options for the feed request
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
   * Recursively fetches all post's entries from a full content feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries.
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  all<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions<R>): Promise<RawPostsResult<R>>;

  /**
   * Recursively fetches all post's entries from a summary feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  all(options: PostsFeedOptionsSummary): Promise<RawPostsResultSummary>;

  /**
   * Fetches a single entry by ID with full content.
   *
   * @remarks * When the type is `comments`, the retrieved resource is not an entry.
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
   * @remarks * When the type is `comments`, the retrieved resource is not an entry.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options including the entry ID
   * @since 1.2
   */
  byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<RawByIdResult<T, "summary">>;

  /**
   * Fetches a single post's entry by ID with full content.
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options including the entry ID
   * @since 1.2.1 The default type is `posts`
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<RawByIdPostResult<R>>;

  /**
   * Fetches a single post's entry by ID with summary content.
   *
   * @param options - Configuration options including the entry ID
   * @since 1.2.1 The default type is `posts`
   */
  byId(options: ByIdPostsOptionsSummary): Promise<RawByIdPostResultSummary>;
}

export {RawWithSummary} from "./entry";
export {RawWithContent} from "./entry";
