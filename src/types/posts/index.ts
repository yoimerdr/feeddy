import {Blog, BlogSummary, PostEntry, PostEntrySummary} from "../feeds";
import {FeedOptions, FeedOptionsFull, FeedOptionsSummary, ImageSize} from "../feeds/shared";
import {RawPostEntry, RawPostEntrySummary} from "../feeds/raw";

export interface InnerFeedOptions<F = FeedOptions> {

  /**
   * The blog's feed options.
   */
  feed: F;
}

export interface PaginatePostsHandler {

  /**
   * The total number of blog posts.
   */
  readonly total: number;

  /**
   * Performs a request to retrieve the posts from the specified page.
   * @param page The page number.
   */
  page(this: PaginatePostsHandler, page: number): Promise<PaginatePostsPageResult>;
}

export interface PaginatePostsSummaryHandler {

  /**
   * The total number of blog posts.
   */
  readonly total: number;

  /**
   * Performs a request to retrieve the posts from the specified page.
   * @param page The page number.
   */
  page(this: PaginatePostsSummaryHandler, page: number): Promise<PaginatePostsPageSummaryResult>;
}

export interface PaginatePostsPageResult {
  /**
   * The retrieved posts.
   */
  posts: PostEntry[],
  /**
   * The retrieved blog's feed.
   */
  blog: Blog;
}

export interface PaginatePostsPageSummaryResult {
  /**
   * The retrieved posts.
   */
  posts: PostEntrySummary[];
  /**
   * The retrieved blog's feed.
   */
  blog: BlogSummary;
}

export type PaginatePostsOptions = InnerFeedOptions<FeedOptionsFull>;

export type PaginatePostsOptionsSummary = InnerFeedOptions<FeedOptionsSummary>;


export interface WithCategoriesPostEntry<E = PostEntry> {

  /**
   * Number of categories to which the current {@link post} relates.
   */
  count: number;

  /**
   * The post resource.
   */
  readonly post: E;
}

export type WithCategoriesPostEntrySummary = WithCategoriesPostEntry<PostEntrySummary>

export interface WithCategoriesPostsOptions<F = FeedOptionsFull> extends InnerFeedOptions<F> {

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
  posts: WithCategoriesPostEntry[],
  /**
   * The retrieved blog's feed.
   */
  blog: Blog;
}

export interface WithCategoriesPostsResultSummary {
  /**
   * The retrieved posts.
   */
  posts: WithCategoriesPostEntrySummary[],
  /**
   * The retrieved blog's feed.
   */
  blog: BlogSummary;
}


export interface Posts {

  /**
   * Paginate the blog using the <b>summary</b> route.
   * @param options The paginate options. All properties must be defined.
   */
  (options: PaginatePostsOptionsSummary): Promise<PaginatePostsSummaryHandler>;

  /**
   * Paginate the blog using the <b>default</b> route.
   * @param options The paginate options. All properties must be defined.
   */
  (options: PaginatePostsOptions): Promise<PaginatePostsHandler>;

  /**
   * Creates the thumbnail url of a post.
   * @param source The post source.
   * @param size The size of the thumbnail.
   * @param ratio The ratio of the thumbnail.
   * @returns The thumbnail url.
   */
  createsThumbnail(source: PostEntry | PostEntrySummary | RawPostEntry | RawPostEntrySummary, size: ImageSize<number> | number, ratio?: number | string): string;

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
}
