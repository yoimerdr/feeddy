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
  page(this: PaginatePostsHandler, page: number): void;
}

export interface PaginatePostsOptions<E = PostEntry, B = Blog, F = FeedOptions> extends InnerFeedOptions<F> {

  /**
   * Callback triggered after the first request to the feed is performed.
   * @param handler The paginate handler.
   * @see {SearchParamsBuilder.paginated}
   */
  onTotal(handler: PaginatePostsHandler): void;

  /**
   * Callback triggered after the {@link PaginatePostsHandler.page} request is performed.
   * @param posts The posts retrieved from the feed.
   * @param blog The retrieved blog.
   */
  onPosts(posts: E[], blog: B): void;
}

export type PaginatePostsOptionsFull = PaginatePostsOptions<PostEntry, Blog, FeedOptionsFull>

export type PaginatePostsOptionsSummary = PaginatePostsOptions<PostEntrySummary, BlogSummary, FeedOptionsSummary>

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

export interface WithCategoriesPostsOptions<E = PostEntry, B = Blog, F = FeedOptions> extends InnerFeedOptions<F> {

  /**
   * The categories of the posts to be retrieved.
   */
  categories: string[];

  /**
   * If true, the retrieved posts will be have all the categories.
   */
  every?: boolean;

  /**
   * Callback triggered after the request to the feed is performed.
   * @param posts The retrieved posts.
   * @param blog The retrieved blog.
   */
  onPosts(posts: E[], blog: B): void;
}

export type WithCategoriesPostsOptionsFull = WithCategoriesPostsOptions<PostEntry, Blog, FeedOptionsFull>

export type WithCategoriesPostsOptionsSummary =
  WithCategoriesPostsOptions<WithCategoriesPostEntrySummary, BlogSummary, FeedOptionsSummary>

export interface Posts {

  /**
   * Paginate the blog using the <b>summary</b> route.
   * @param options The paginate options. All properties must be defined.
   */
  (options: PaginatePostsOptionsSummary): void;

  /**
   * Paginate the blog using the <b>default</b> route.
   * @param options The paginate options. All properties must be defined.
   */
  (options: PaginatePostsOptionsFull): void;

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
  withCategories(options: WithCategoriesPostsOptionsSummary): void;

  /**
   * Retrieves the posts from the <b>default</b> route with the given categories.
   *
   * All posts are retrieved, but it is sliced by the value of the `max-results` parameter.
   * @param options The request options.
   */
  withCategories(options: WithCategoriesPostsOptionsFull): void;


}
