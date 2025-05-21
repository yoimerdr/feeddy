import {
  BaseFeedOptions,
  FeedByIdOptions,
  FeedByIdOptionsSummary,
  FeedOptions,
  FeedOptionsSummary,
  FeedResult,
  FeedRoute,
  FeedType,
  InnerFeedOptions
} from "./feeds/options";
import {BaseBlog, BaseEntry} from "./feeds/entry";
import {BasePostEntry, PostEntry, PostEntrySummary, PostsBlog, PostsBlogSummary} from "./feeds/posts";
import {CommentEntry, CommentEntrySummary, CommentsBlog, CommentsBlogSummary} from "./feeds/comments";
import {PageEntry, PageEntrySummary, PagesBlog, PagesBlogSummary} from "./feeds/pages";
import {ByIdResult} from "./feeds";
import {KeyableObject} from "@jstls/types/core/objects";
import {
  ByIdPostResult,
  ByIdPostResultSummary,
  ByIdPostsOptions, ByIdPostsOptionsSummary,
  PostsHandler,
  PostsOptions,
  PostsOptionsSummary
} from "./posts";


/**
 * Represents the result of retrieving entries from a blog feed.
 * @template T - The type of entries, extending BaseEntry
 * @template B - The type of blog feed, extending BaseBlog
 */
export type EntriesResult<T extends BaseEntry = BaseEntry, B extends BaseBlog = BaseBlog> = {
  /**
   * The retrieved entries from the blog feed.
   */
  readonly entries: T[];

  /**
   * The retrieved blog.
   */
  readonly blog: B;
} & (T extends BasePostEntry ? {
  /**
   * This property has been removed in version 1.2. Use `entries` instead.
   * @deprecated
   * @see {entries}
   */
  readonly posts: T[];
} : {})

/**
 * The result type for an entries handler, determined by the feed type and route.
 * @template T - The type of feed (posts, comments, or pages)
 * @template R - The route type (summary or full)
 */
export type EntriesHandlerResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> =
  FeedResult<T, R,
    EntriesResult<PostEntrySummary, PostsBlogSummary>, EntriesResult<CommentEntrySummary, CommentsBlogSummary>,
    EntriesResult<PageEntrySummary, PagesBlogSummary>,
    EntriesResult<PostEntry, PostsBlog>, EntriesResult<CommentEntry, CommentsBlog>,
    EntriesResult<PageEntry, PagesBlog>>

/**
 * Interface for handling paginated blog entries.
 * @template T - The type of feed (posts, comments, or pages)
 * @template R - The route type (summary or full)
 * @template H - The handler type itself, for method chaining.
 */
export interface EntriesHandler<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute, H extends EntriesHandler = EntriesHandler<T, R, any>, > {
  /**
   * The total number of entries available in the blog feed.
   */
  readonly total: number;

  /**
   * Retrieves entries from a specific page of the blog feed.
   * @param page - The 1-based page number to retrieve
   */
  page(this: H, page: number): Promise<EntriesHandlerResult<T, R>>;
}

/**
 * Options for configuring entries retrieval with route control.
 * @template T - The type of feed (posts, comments, or pages)
 * @template R - The route type (summary or full)
 */
export type EntriesOptions<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> = InnerFeedOptions<FeedOptions<T, R>>;

/**
 * Options for configuring entries retrieval using the summary route.
 * @template T - The type of feed (posts, comments, or pages)
 */
export type EntriesOptionsSummary<T extends FeedType = FeedType> = InnerFeedOptions<FeedOptionsSummary<T>>;

/**
 * Basic options for configuring entries retrieval with minimal requirements.
 */
export type EntriesSimpleOptions = InnerFeedOptions<Partial<BaseFeedOptions>>;

/**
 * Function type for add custom properties to the entries handler.
 * @template B - The type of blog feed
 * @template T - The target transformation type
 */
export type EntriesHandlerSimpleExtra<B extends BaseBlog, T> = (blog: B) => T;

/**
 * Type for handling additional transformations based on feed type and route.
 * @template T - The type of feed (posts, comments, or pages)
 * @template R - The route type (summary or full)
 * @template E - The extra data type to be produced
 */
export type EntriesHandlerExtra<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute, E = KeyableObject> =
  FeedResult<T, R,
    EntriesHandlerSimpleExtra<PostsBlogSummary, E>,
    EntriesHandlerSimpleExtra<CommentsBlogSummary, E>,
    EntriesHandlerSimpleExtra<PagesBlogSummary, E>,
    EntriesHandlerSimpleExtra<PostsBlog, E>,
    EntriesHandlerSimpleExtra<CommentsBlog, E>,
    EntriesHandlerSimpleExtra<PagesBlog, E>>

/**
 * Interface for retrieving blog entries.
 *
 * Provides methods for paginated access and individual entry retrieval.
 */
export interface Entries {
  /**
   * Creates a handler for paginated access to blog entries.
   * @template T - The type of feed (posts, comments, or pages)
   * @template R - The route type (summary or full)
   * @param options - Configuration options for the entries retrieval
   */<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: EntriesOptions<T, R>): Promise<EntriesHandler<T, R>>;

  /**
   * Creates a handler for paginated access to blog entries using the summary route.
   * @template T - The type of feed (posts, comments, or pages)
   * @param options - Configuration options for the summary entries retrieval
   */<T extends FeedType = FeedType>(options: EntriesOptionsSummary<T>): Promise<EntriesHandler<T, "summary">>;

  /**
   * Creates a handler for paginated access to blog posts using the summary route.
   * @param options - Configuration options for the summary posts retrieval
   * @since 1.2.1 The default type is `posts`
   */
  (options: PostsOptionsSummary): Promise<PostsHandler<"summary">>;

  /**
   * Creates a handler for paginated access to blog posts.
   * @template R - The route type (summary or full)
   * @param options - Configuration options for the posts retrieval
   * @since 1.2.1 The default type is `posts`
   */<R extends FeedRoute = FeedRoute>(options: PostsOptions<R>): Promise<PostsHandler<R>>;

  /**
   * Retrieves a specific entry by its ID with route control.
   * @template T - The type of feed (posts, comments, or pages)
   * @template R - The route type (summary or full)
   * @param options - Configuration options including the entry ID
   */
  byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<ByIdResult<T, R>>;

  /**
   * Retrieves a specific entry by its ID using the summary route.
   * @template T - The type of feed (posts, comments, or pages)
   * @param options - Configuration options including the entry ID
   */
  byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<ByIdResult<T, "summary">>;

  /**
   * Retrieves a specific page by its ID with route control.
   * @template R - The route type (summary or full)
   * @param options - Configuration options including the page ID
   * @since 1.2.1 The default type is `posts`
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<ByIdPostResult<R>>;

  /**
   * Retrieves a specific page by its ID using the summary route.
   * @param options - Configuration options including the page ID
   * @since 1.2.1 The default type is `posts`
   */
  byId(options: ByIdPostsOptionsSummary): Promise<ByIdPostResultSummary>;

  /**
   * Extracts or generates a URL-friendly pathname string from a blog entry.
   *
   * @example
   * createsPathname("Entry's Title") // "entry-s-title"
   *
   * @example
   * createsPathname({title: "Entry's Title"}) // "entry-s-title"
   *
   * @example
   * createsPathname(entry) // "entry-s-alternate-url"
   *
   * @param source The blog entry object or string to generate URL from.
   * @param length The maximum length for the generated URL.
   * @returns A URL-friendly pathname string derived from either the entry's alternate link or title
   * @since 1.2.1
   */
  createsPathname(source: Partial<BaseEntry> | string, length?: number): string;
}

