import {
  FeedByIdOptions,
  FeedOptions,
  FeedRoute,
  InnerFeedOptions
} from "./feeds/options";
import {ByIdResult} from "./feeds";
import {EntriesHandler,} from "./entries";

/**
 * Interface for handling paginated blog pages.
 * @template R - The route type (summary or full)
 */
export interface PagesHandler<R extends FeedRoute = FeedRoute> extends EntriesHandler<"pages", R, PagesHandler<R>> {
}

/**
 * The options for configuring a blog feed pages request.
 * @template R - The route type (summary or full)
 */
export type PagesFeedOptions<R extends FeedRoute = FeedRoute> = Omit<FeedOptions<"pages", R>, "type">

/**
 * The options for configuring a summary blog pages feed request.
 */
export type PagesFeedOptionsSummary = Omit<PagesFeedOptions, "route">;

/**
 * Options for configuring pages retrieval with route control.
 * @template T - The type of feed (posts, pages, or pages)
 */
export type PagesOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<PagesFeedOptions<R>>;

/**
 * Options for configuring pages retrieval using the summary route.
 */
export type PagesOptionsSummary = InnerFeedOptions<PagesFeedOptionsSummary>;

/**
 * The options for configuring a blog feed pages request by ID.
 * @template R - The route type (summary or full)
 */
export type ByIdPagesOptions<R extends FeedRoute = FeedRoute> = FeedByIdOptions<"pages", R>;

/**
 * The options for configuring a summary blog pages feed request by ID.
 */
export type ByIdPagesOptionsSummary = FeedByIdOptions<"pages", "summary">;

/**
 * Interface for retrieving blog pages.
 *
 * Provides methods for paginated access and individual entry retrieval.
 */
export interface Pages {
  /**
   * Creates a handler for paginated access to blog pages.
   * @template R - The route type (summary or full)
   * @param options - Configuration options for the pages retrieval
   */<R extends FeedRoute = FeedRoute>(options: PagesOptions<R>): Promise<PagesHandler<R>>;

  /**
   * Creates a handler for paginated access to blog pages using the summary route.
   * @param options - Configuration options for the summary pages retrieval
   */
  (options: PagesOptionsSummary): Promise<PagesHandler<"summary">>;

  /**
   * Retrieves a specific page by its ID with route control.
   * @template R - The route type (summary or full)
   * @param options - Configuration options including the page ID
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdPagesOptions<R>): Promise<ByIdResult<"pages", R>>;

  /**
   * Retrieves a specific page by its ID using the summary route.
   * @param options - Configuration options including the page ID
   */
  byId(options: ByIdPagesOptionsSummary): Promise<ByIdResult<"pages", "summary">>;
}
