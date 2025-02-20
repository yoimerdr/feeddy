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
import {PostsBlog, PostsBlogSummary} from "./posts";
import {CommentsBlog, CommentsBlogSummary} from "./comments";
import {PagesBlogSummary} from "./pages";

export type Result<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute, > =
  FeedResult<T, R,
    PostsBlogSummary, CommentsBlogSummary, PagesBlogSummary,
    PostsBlog, CommentsBlog, PostsBlog>

export type ByIdResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> =
  FeedResult<T, R,
    PostsBlogSummary, never, PagesBlogSummary,
    PostsBlog, never, PostsBlog>

export interface Feed {
  /**
   * Makes a get request to the <b>summary</b> blogger feed API using the fetch API.
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * @param options The request options.
   */<T extends FeedType = FeedType, >(options: FeedOptionsSummary<T>): Promise<Result<T, "summary">>;

  /**
   * Makes a get request to the <b>default</b> blogger feed API using the fetch API.
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * @param options The request options.
   */<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<Result<T, R>>;

  /**
   * Makes a recursive get request to the <b>summary</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   */
  all<T extends FeedType = FeedType, >(options: FeedOptionsSummary<T>): Promise<Result<T, "summary">>;

  /**
   * Makes a recursive get request to the <b>default</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   */
  all<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<Result<T, R>>;

  byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<ByIdResult<T, R>>;

  byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<ByIdResult<T, "summary">>;

  /**
   * The handler to make requests to the blogger feed API directly.
   */
  readonly raw: RawFeed
}
