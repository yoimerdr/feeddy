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
import {
  ByIdPostResult, ByIdPostResultSummary,
  ByIdPostsOptions, ByIdPostsOptionsSummary,
  PostsFeedOptions,
  PostsFeedOptionsSummary,
  PostsResult,
  PostsResultSummary
} from "../posts";

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
   * Fetches a posts feed with full content.
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request.
   *
   * @since 1.2.1 The default type is `posts`
   */<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions): Promise<PostsResult<R>>;

  /**
   * Fetches a summary posts feed.
   *
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  (options: PostsFeedOptionsSummary): Promise<PostsFeedOptionsSummary>;

  /**
   * Recursively fetches all entries from a summary feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options for the feed request
   */
  all<T extends FeedType = FeedType, >(options: FeedOptionsSummary<T>): Promise<Result<T, "summary">>;

  /**
   * Recursively fetches all entries from a full content feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   */
  all<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<Result<T, R>>;

  /**
   * Recursively fetches all entries from a full content posts feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  all<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions<R>): Promise<PostsResult<R>>;

  /**
   * Recursively fetches all entries from a summary posts feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  all(options: PostsFeedOptionsSummary): Promise<PostsResultSummary>;

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
  byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<ByIdResult<T, R>>;

  /**
   * Fetches a single entry by ID with summary content.
   *
   * @remarks * When the type is `comments`, the retrieved resource is not an entry.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options including the entry ID
   * @since 1.2
   */
  byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<ByIdResult<T, "summary">>;

  /**
   * Fetches a single post's entry by ID with full content.
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options including the entry ID
   * @since 1.2.1 The default type is `posts`
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<ByIdPostResult<R>>;

  /**
   * Fetches a single post's entry by ID with summary content.
   *
   * @param options - Configuration options including the entry ID
   * @since 1.2.1 The default type is `posts`
   */
  byId(options: ByIdPostsOptionsSummary): Promise<ByIdPostResultSummary>;

  /**
   * The handler to make requests to the blogger feed API directly.
   */
  readonly raw: RawFeed
}
