import {
  FeedOptions,
  FeedRoute,
  InnerFeedOptions
} from "./feeds/options";
import {EntriesHandler,} from "./entries";
import {WithId} from "./index";

/**
 * Interface for handling paginated blog comments.
 * @template R - The route type (summary or full)
 */
export interface CommentsHandler<R extends FeedRoute = FeedRoute> extends EntriesHandler<"comments", R, CommentsHandler<R>> {
}

/**
 * The options for configuring a blog feed comments request.
 * @template R - The route type (summary or full)
 */
export type CommentsFeedOptions<R extends FeedRoute = FeedRoute> = Omit<FeedOptions<"comments", R>, "type">

/**
 * The options for configuring a summary blog comments feed request.
 */
export type CommentsFeedOptionsSummary = Omit<CommentsFeedOptions, "route">;

/**
 * The options for configuring a blog feed comments request by ID.
 * @template R - The route type (summary or full)
 */
export type ByIdCommentsOptions<R extends FeedRoute = FeedRoute> = CommentsOptions<R> & WithId;

/**
 * The options for configuring a summary blog comments feed request by ID.
 */
export type ByIdCommentsOptionsSummary = CommentsOptionsSummary & WithId;

/**
 * Options for configuring comments retrieval with route control.
 * @template T - The type of feed (posts, comments, or pages)
 */
export type CommentsOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<CommentsFeedOptions<R>>;

/**
 * Options for configuring comments retrieval using the summary route.
 */
export type CommentsOptionsSummary = InnerFeedOptions<CommentsFeedOptionsSummary>;

/**
 * Interface for retrieving blog comments.
 *
 * Provides methods for paginated access and individual entry retrieval.
 */
export interface Comments {
  /**
   * Creates a handler for paginated access to blog comments.
   * @template R - The route type (summary or full)
   * @param options - Configuration options for the comments retrieval
   */<R extends FeedRoute = FeedRoute>(options: CommentsOptions<R>): Promise<CommentsHandler<R>>;

  /**
   * Creates a handler for paginated access to blog comments using the summary route.
   * @param options - Configuration options for the summary comments retrieval
   */
  (options: CommentsOptionsSummary): Promise<CommentsHandler<"summary">>;

  /**
   * Creates a handler for paginated access to a specific entry comments by its ID with route control.
   * @template R - The route type (summary or full)
   * @param options - Configuration options including the entry ID
   */
  byId<R extends FeedRoute = FeedRoute, >(options: ByIdCommentsOptions<R>): Promise<CommentsHandler<R>>;

  /**
   * Creates a handler for paginated access to a specific entry comments by its ID using the summary route.
   * @param options - Configuration options including the entry ID
   */
  byId(options: ByIdCommentsOptionsSummary): Promise<CommentsHandler<"summary">>;
}
