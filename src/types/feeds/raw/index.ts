import {RawPostsBlog, RawPostsBlogSummary, RawPostsEntryBlog, RawPostsEntryBlogSummary} from "./posts";
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

export type RawResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> =
  FeedResult<T, R,
    RawPostsBlogSummary, RawCommentsBlogSummary, RawPagesBlogSummary,
    RawPostsBlog, RawCommentsBlog, RawPagesBlog>;

export type RawByIdResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> =
  FeedResult<T, R,
    RawPostsEntryBlogSummary, never, RawPagesEntryBlogSummary,
    RawPostsEntryBlog, never, RawPagesEntryBlog>

export interface RawFeed {

  /**
   * Makes a get request to the <b>summary</b> blogger feed API using the fetch API.
   * @param options The request options.
   */<T extends FeedType = FeedType, >(options: FeedOptionsSummary<T>): Promise<RawResult<T, "summary">>;

  /**
   * Makes a get request to the <b>default</b> blogger feed API using the fetch API.
   * @param options The request options.
   */<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<RawResult<T, R>>;

  /**
   * Makes a recursive get request to the <b>summary</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   * @see {rawGet}
   */
  all<T extends FeedType = FeedType, >(options: FeedOptionsSummary<T>): Promise<RawResult<T, "summary">>;

  /**
   * Makes a recursive get request to the <b>default</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   * @see {rawGet}
   */
  all<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<RawResult<T, R>>;

  byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<RawByIdResult<T, R>>;
  byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<RawByIdResult<T, "summary">>;
}

export {RawWithSummary} from "./entry";
export {RawWithContent} from "./entry";
