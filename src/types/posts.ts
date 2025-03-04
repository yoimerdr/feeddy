import {BasePostEntry, PostEntry, PostEntrySummary, PostsBlog} from "./feeds/posts";
import {EntriesHandler,} from "./entries";
import {FeedByIdOptions, FeedOptions, FeedOptionsSummary, FeedRoute, InnerFeedOptions} from "./feeds/options";
import {ImageSize} from "./feeds/shared";
import {ByIdResult} from "./feeds";


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

export interface WithCategoriesPostsOptions<F = FeedOptions> extends InnerFeedOptions<F> {

  /**
   * The categories of the posts to be retrieved.
   */
  categories: string[];

  /**
   * If true, the retrieved posts will be have all the categories.
   */
  every?: boolean;
}


export type WithCategoriesPostsOptionsSummary = WithCategoriesPostsOptions<FeedOptionsSummary>;

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
   * The categories with which the posts has been tagged.
   * @since 1.2
   */
  readonly categories: string[];
}

/**
 * The options for configuring a blog feed posts request.
 * @template R - The route type (summary or full)
 */
export type PostsFeedOptions<R extends FeedRoute = FeedRoute> = Omit<FeedOptions<"posts", R>, "type">

/**
 * The options for configuring a summary blog posts feed request.
 */
export type PostsFeedOptionsSummary = Omit<PostsFeedOptions, "route">;

/**
 * Options for configuring posts retrieval with route control.
 * @template T - The type of feed (posts, posts, or posts)
 */
export type PostsOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<PostsFeedOptions<R>>;

/**
 * Options for configuring posts retrieval using the summary route.
 */
export type PostsOptionsSummary = InnerFeedOptions<PostsFeedOptionsSummary>;

/**
 * The options for configuring a blog feed posts request by ID.
 * @template R - The route type (summary or full)
 */
export type ByIdPostsOptions<R extends FeedRoute = FeedRoute> = FeedByIdOptions<"posts", R>;

/**
 * The options for configuring a summary blog posts feed request by ID.
 */
export type ByIdPostsOptionsSummary = FeedByIdOptions<"posts", "summary">;

/**
 * Interface for retrieving blog posts.
 *
 * Provides methods for paginated access and individual entry retrieval.
 */
export interface Posts {

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
   */
  createsThumbnail(source: BasePostEntry, size: ImageSize<number> | number, ratio?: number | string): string;

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
   * All posts are retrieved, but it is sliced by the value of the `max-results` parameter.
   * @param options The request options.
   */
  withCategories(options: WithCategoriesPostsOptions): Promise<WithCategoriesPostsResult>;

  /**
   * Retrieves a specific page by its ID with route control.
   * @template R - The route type (summary or full)
   * @param options - Configuration options including the page ID
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<ByIdResult<"posts", R>>;

  /**
   * Retrieves a specific page by its ID using the summary route.
   * @param options - Configuration options including the page ID
   */
  byId(options: ByIdPostsOptionsSummary): Promise<ByIdResult<"posts", "summary">>;
}
