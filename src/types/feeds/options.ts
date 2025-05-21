import {RequestFeedParams} from "./shared/params";
import {WithId} from "@/types";

/**
 * The route options of the blog's feed.
 */
export type FeedRoute = 'summary' | "full";

/**
 * The type options of the blog's feed.
 */
export type FeedType = "posts" | "comments" | "pages";


export interface BaseFeedOptions<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> {
  /**
   * The blog's URL.
   */
  blogUrl?: string;

  /**
   * The route of the blog's feed.
   *
   * The possible values are 'full' or 'summary'.
   */
  route: R;

  /**
   * The type of the blog's feed.
   *
   * The possible values are "posts" or "comments" or "pages".
   */
  type: T;

  /**
   * The parameters for the feed request.
   */
  params?: Partial<RequestFeedParams>;
}

/**
 * The options for configuring a blog feed request.
 * @template T - The type of feed (posts, comments, or pages)
 * @template R - The route type (summary or full)
 */
export type FeedOptions<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> = BaseFeedOptions<T, R>;

/**
 * The options for configuring a summary blog feed request.
 * @template T - The type of feed (posts, comments, or pages)
 */
export type FeedOptionsSummary<T extends FeedType = FeedType> = Omit<FeedOptions<T, "summary">, "route">;

/**
 * Base interface for options that contain feed configuration.
 * @template F - The type of feed options, defaults to BaseFeedOptions
 */
export interface InnerFeedOptions<F = BaseFeedOptions> {

  /**
   * The blog's feed options.
   */
  feed: F;
}

/**
 * The options for configuring a blog feed request by ID.
 * @template T - The type of feed (posts, comments, or pages)
 * @template R - The route type (summary or full)
 */
export interface FeedByIdOptions<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> extends InnerFeedOptions<FeedOptions<T, R>>, WithId {
}

/**
 * The options for configuring a summary blog feed request by ID.
 * @template T - The type of feed (posts, comments, or pages)
 */
export interface FeedByIdOptionsSummary<T extends FeedType = FeedType> extends InnerFeedOptions<FeedOptionsSummary<T>>, WithId {
}

/**
 * Determines what result will be obtained according to the route and type of feed.
 */
export type FeedResult<T extends FeedType = FeedType,
  R extends FeedRoute = FeedRoute,
  SP = never, SC = never, SPP = never,
  FP = never, FC = never, FPP = never, > =
  R extends "summary" ? (
      T extends "posts" ? SP :
        T extends "comments" ? SC :
          T extends "pages" ? SPP :
            never
      ) :
    R extends "full" ? (
        T extends "posts" ? FP :
          T extends "comments" ? FC :
            T extends "pages" ? FPP :
              never
        ) :
      never;
