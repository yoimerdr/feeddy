import {BasePostEntry, PostEntry, PostEntrySummary, PostsBlog} from "./feeds/posts";
import {EntriesHandler,} from "./entries";
import {FeedOptions, FeedRoute, InnerFeedOptions} from "./feeds/options";
import {ImageSize} from "./feeds/shared";
import {ByIdResult, Result} from "./feeds";
import {WithId} from "./index";


export interface WithCategoriesPost<E extends BasePostEntry = PostEntry> {

  /**
   * Number of categories to which the current {@link post} relates.
   */
  count: number;

  /**
   * The post resource.
   */
  readonly post: E;
}

export type WithCategoriesPostSummary = WithCategoriesPost<PostEntrySummary>

export interface WithCategoriesPostsOptions<F = PostsFeedOptions> extends InnerFeedOptions<F> {

  /**
   * The categories of the posts to be retrieved.
   */
  categories: string[];

  /**
   * If true, the retrieved posts will have all the categories.
   */
  every?: boolean;
}


export type WithCategoriesPostsOptionsSummary = WithCategoriesPostsOptions<PostsFeedOptionsSummary>;

export interface WithCategoriesPostsResult {
  /**
   * The retrieved posts.
   */
  posts: WithCategoriesPost[],
  /**
   * The retrieved blog's feed.
   */
  blog: PostsBlog;
}

export interface WithCategoriesPostsResultSummary {
  /**
   * The retrieved posts.
   */
  posts: WithCategoriesPostSummary[],
  /**
   * The retrieved blog's feed.
   */
  blog: PostsBlog;
}

/**
 * Interface for handling paginated blog posts.
 * @template R - The route type (summary or full)
 */
export interface PostsHandler<R extends FeedRoute = FeedRoute> extends EntriesHandler<"posts", R, PostsHandler<R>> {
  /**
   * The categories with which the posts have been tagged.
   * @since 1.2
   */
  readonly categories: string[];
}

/**
 * @since 1.3.0
 */
export type PostsSsrParameters = {

  /**
   * The exclusive max bound on the entry update date.
   */
  "updated-max": string;

  /**
   * The maximum number of results to be retrieved.
   */
  "max-results": number;

  /**
   * Whether to order the results by date.
   */
  "by-date": boolean;

  /**
   * The full-text query string.
   */
  q: string;

  /**
   * The 0-based index of the first result to be retrieved.
   */
  start: number;
}

/**
 * @since 1.3.0
 */
export interface PostsSsrHandlerResult {
  /**
   * The parameters used in the url.
   */
  parameters: Partial<PostsSsrParameters>;
  /**
   * The relative url to the ssr page.
   */
  url: string;
}

/**
 * Interface for handling paginated blog posts.
 *
 * It is not to get the data from the posts, but to build valid urls for blogger to build all the content by itself.
 *
 * @since 1.3.0
 */
export interface PostsSsrHandler extends Omit<PostsHandler<"summary">, "page"> {
  /**
   */
  readonly categories: string[];

  /**
   * Creates an object containing a valid url for blogger ssr.
   *
   * @example
   * // on query ssr
   * handler.page(1) // { url: "/search?by-date=true&max-results=12&q=label:name" }
   * handler.page(2) // { url: "/search?by-date=true&max-results=12&q=label:name&start=12" }
   *
   * // on label ssr
   * handler.page(1) // { url: "/search/label/2dcg?max-results=12" }
   * handler.page(2) // { url: "/search/label/2dcg?max-results=12&updated-max=YYYY-MM-DDThh:mm:ss-TH:TM" }
   *
   * // on default ssr
   * handler.page(1) // { url: "/" }
   * handler.page(2) // { url: "/search?max-results=12&updated-max=YYYY-MM-DDThh:mm:ss-TH:TM" }
   *
   * @param page - The 1-based page number to retrieve
   */
  page(this: PostsSsrHandler, page: number): Promise<PostsSsrHandlerResult>;
}

/**
 * The options for configuring a blog feed posts request.
 * @template R - The route type (summary or full)
 */
export type PostsFeedOptions<R extends FeedRoute = FeedRoute> = Omit<FeedOptions<"posts", R>, "type">;

export type PostsResult<R extends FeedRoute = FeedRoute> = Result<"posts", R>;

export type PostsResultSummary = PostsResult<"summary">;

export type ByIdPostResult<R extends FeedRoute = FeedRoute> = ByIdResult<"posts", R>;

export type ByIdPostResultSummary = ByIdPostResult<"summary">;

/**
 * The options for configuring a summary blog posts feed request.
 */
export type PostsFeedOptionsSummary = Omit<PostsFeedOptions, "route">;

/**
 * Options for configuring posts retrieval with route control.
 * @template T - The type of feed (summary, or default)
 */
export type PostsOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<PostsFeedOptions<R>>;

export type SsrType = "label" | "query" | "default" | "default2";

/**
 * Options for configuring ssr retrieval.
 */
export interface PostsSsrOptions extends PostsOptionsSummary {
  /**
   * The ssr mode.
   */
  ssr?: SsrType;
  /**
   * The category to use on 'label' ssr.
   *
   * Ignored in other modes.
   */
  category?: string;
}

/**
 * Options for configuring posts retrieval using the summary route.
 */
export type PostsOptionsSummary = InnerFeedOptions<PostsFeedOptionsSummary>;

/**
 * The options for configuring a blog feed posts request by ID.
 * @template R - The route type (summary or full)
 */
export type ByIdPostsOptions<R extends FeedRoute = FeedRoute> = PostsOptions<R> & WithId;

/**
 * The options for configuring a summary blog posts feed request by ID.
 */
export type ByIdPostsOptionsSummary = PostsOptionsSummary & WithId;

/** @deprecated*/
export type Posts = PostsNamespace;

/**
 * Interface for retrieving blog posts.
 *
 * Provides methods for paginated access and individual entry retrieval.
 */
export interface PostsNamespace {

  /**
   * Creates a handler for paginated access to blog posts using the summary route.
   * @param options - Configuration options for the summary posts retrieval
   */
  (options: PostsOptionsSummary): Promise<PostsHandler<"summary">>;

  /**
   * Creates a handler for paginated access to blog posts.
   * @template R - The route type (summary or full)
   * @param options - Configuration options for the posts retrieval
   */<R extends FeedRoute = FeedRoute>(options: PostsOptions<R>): Promise<PostsHandler<R>>;

  /**
   * Creates the thumbnail url of a post.
   * @param source The post source.
   * @param size The size of the thumbnail.
   * @param ratio The ratio of the thumbnail.
   * @returns The thumbnail url.
   *
   * @since 1.2.1 The source can be a string
   */
  createsThumbnail(source: BasePostEntry | string, size: ImageSize<number> | number, ratio?: number | string): string;

  /**
   * Retrieves the posts from the <b>summary</b> with the given categories.
   *
   * All posts are retrieved, but it is sliced by the value of the `max-results` parameter.
   * @param options The request options.
   */
  withCategories(options: WithCategoriesPostsOptionsSummary): Promise<WithCategoriesPostsResultSummary>;

  /**
   * Retrieves the posts from the <b>default</b> route with the given categories.
   *
   * @remarks * All posts are retrieved, but it is sliced by the value of the `max-results` parameter.
   * @param options The request options.
   */
  withCategories(options: WithCategoriesPostsOptions): Promise<WithCategoriesPostsResult>;

  /**
   * Retrieves a specific page by its ID with route control.
   * @template R - The route type (summary or full)
   * @param options - Configuration options including the page ID
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<ByIdPostResult<R>>;

  /**
   * Retrieves a specific page by its ID using the summary route.
   * @param options - Configuration options including the page ID
   */
  byId(options: ByIdPostsOptionsSummary): Promise<ByIdPostResultSummary>;
}
