import {Blog, PostEntry, PostEntrySummary} from "../feeds";
import {FeedOptions, FeedOptionsSummary, ImageSize} from "../feeds/shared";
import {RawPostEntry, RawPostEntrySummary} from "../feeds/raw";

export interface InnerFeedOptions {

  /**
   * The blog's feed options.
   */
  feed: FeedOptions;
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

export interface PaginatePostsOptions extends InnerFeedOptions {

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
  onPosts(posts: PostEntry[], blog: Blog): void;
}

export type PaginatePostsOptionsSummary = PaginatePostsOptions & {

  /**
   * The blog's feed options.
   */
  feed: FeedOptionsSummary;

  /**
   * Callback triggered after the {@link PaginatePostsHandler.page} request is performed.
   * @param posts The posts retrieved from the feed.
   * @param blog The retrieved blog.
   */
  onPosts(posts: PostEntrySummary[], blog: Blog): void;
}

export interface WithCategoriesPostEntry {

  /**
   * Number of categories to which the current {@link post} relates.
   */
  count: number;

  /**
   * The post resource.
   */
  readonly post: PostEntry;
}

export type WithCategoriesPostEntrySummary = WithCategoriesPostEntry & {

  /**
   * The post resource.
   */
  readonly post: PostEntrySummary;
}

export interface WithCategoriesPostsOptions extends InnerFeedOptions {

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
  onPosts(posts: WithCategoriesPostEntry[], blog: Blog): void;
}


export type WithCategoriesPostsOptionsSummary = WithCategoriesPostsOptions & {

  /**
   * The blog's feed options.
   */
  feed: FeedOptionsSummary;

  /**
   * Callback triggered after the request to the feed is performed.
   * @param posts The retrieved posts.
   * @param blog The retrieved blog.
   */
  onPosts(posts: WithCategoriesPostEntrySummary[], blog: Blog): void;
}

export interface Posts {
  /**
   * Paginate the blog.
   * @param options The paginate options. All properties must be defined.
   */
  (options: PaginatePostsOptions): void;

  /**
   * Creates the thumbnail url of a post.
   * @param source The post source.
   * @param size The size of the thumbnail.
   * @param ratio The ratio of the thumbnail.
   * @returns The thumbnail url.
   */
  createsThumbnail(source: PostEntry | PostEntrySummary | RawPostEntry | RawPostEntrySummary, size: ImageSize<number> | number, ratio?: number | string): string;

  /**
   * Retrieves the related posts.
   * @param options The related posts options.
   */
  withCategories(options: WithCategoriesPostsOptions): void;
}
