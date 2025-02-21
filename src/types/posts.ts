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


export interface PostsHandler<R extends FeedRoute = FeedRoute> extends EntriesHandler<"posts", R> {
  categories: string[];
}

export type PostsFeedOptions<R extends FeedRoute = FeedRoute> = Omit<FeedOptions<"posts", R>, "type">
export type PostsFeedOptionsSummary = Omit<PostsFeedOptions, "route">;

export type PostsOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<PostsFeedOptions<R>>;
export type PostsOptionsSummary = InnerFeedOptions<PostsFeedOptionsSummary>;

export type ByIdPostsOptions<R extends FeedRoute = FeedRoute> = FeedByIdOptions<"posts", R>;
export type ByIdPostsOptionsSummary = FeedByIdOptions<"posts", "summary">;

export interface Posts {

  /**
   * Paginate the blog using the <b>summary</b> route.
   * @param options The paginate options. All properties must be defined.
   */
  (options: PostsOptionsSummary): Promise<PostsHandler<"summary">>;

  /**
   * Paginate the blog using the <b>default</b> route.
   * @param options The paginate options. All properties must be defined.
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

  byId<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<ByIdResult<"posts", R>>;

  byId(options: ByIdPostsOptionsSummary): Promise<ByIdResult<"posts", "summary">>;
}
