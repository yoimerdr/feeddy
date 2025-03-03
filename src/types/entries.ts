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
import {PostEntry, PostEntrySummary, PostsBlog, PostsBlogSummary} from "./feeds/posts";
import {CommentEntry, CommentEntrySummary, CommentsBlog, CommentsBlogSummary} from "./feeds/comments";
import {PageEntry, PageEntrySummary, PagesBlog, PagesBlogSummary} from "./feeds/pages";
import {ByIdResult} from "./feeds";
import {KeyableObject} from "../../lib/jstls/src/types/core/objects";


export interface EntriesResult<T extends BaseEntry = BaseEntry, B extends BaseBlog = BaseBlog> {
  /**
   * The retrieved entries.
   */
  entries: T[];

  /**
   * The retrieved blog's feed.
   */
  blog: B;
}

export type EntriesHandlerResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> =
  FeedResult<T, R,
    EntriesResult<PostEntrySummary, PostsBlogSummary>, EntriesResult<CommentEntrySummary, CommentsBlogSummary>,
    EntriesResult<PageEntrySummary, PagesBlogSummary>,
    EntriesResult<PostEntry, PostsBlog>, EntriesResult<CommentEntry, CommentsBlog>,
    EntriesResult<PageEntry, PagesBlog>>


export interface EntriesHandler<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute, H extends EntriesHandler = EntriesHandler<T, R, any>, > {
  /**
   * The total number of blog posts.
   */
  readonly total: number;

  /**
   * Performs a request to retrieve the posts from the specified page.
   * @param page The page number.
   */
  page(this: H, page: number): Promise<EntriesHandlerResult<T, R>>;
}

export type EntriesOptions<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> = InnerFeedOptions<FeedOptions<T, R>>;
export type EntriesOptionsSummary<T extends FeedType = FeedType> = InnerFeedOptions<FeedOptionsSummary<T>>;
export type EntriesSimpleOptions = InnerFeedOptions<Partial<BaseFeedOptions>>;
export type EntriesHandlerSimpleExtra<B extends BaseBlog, T> = (blog: B) => T;
export type EntriesHandlerExtra<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute, E = KeyableObject> =
  FeedResult<T, R,
    EntriesHandlerSimpleExtra<PostsBlogSummary, E>,
    EntriesHandlerSimpleExtra<CommentsBlogSummary, E>,
    EntriesHandlerSimpleExtra<PagesBlogSummary, E>,
    EntriesHandlerSimpleExtra<PostsBlog, E>,
    EntriesHandlerSimpleExtra<CommentsBlog, E>,
    EntriesHandlerSimpleExtra<PagesBlog, E>>


export interface Entries {
  <T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: EntriesOptions<T, R>): Promise<EntriesHandler<T, R>>;

  <T extends FeedType = FeedType>(options: EntriesOptionsSummary<T>): Promise<EntriesHandler<T, "summary">>;

  byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<ByIdResult<T, R>>;

  byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<ByIdResult<T, "summary">>;
}

