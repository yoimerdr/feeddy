import {RequestFeedParams} from "./shared/params";
import {WithId} from "../index";

/**
 * The route options of the blog's feed.
 */
export type FeedRoute = 'summary' | "full";

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

  type: T;

  /**
   * The parameters for the feed request.
   */
  params?: Partial<RequestFeedParams>;
}

export type FeedOptions<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> = BaseFeedOptions<T, R>;

export type FeedOptionsSummary<T extends FeedType = FeedType> = Omit<FeedOptions<T, "summary">, "route">;

export interface InnerFeedOptions<F = BaseFeedOptions> {

  /**
   * The blog's feed options.
   */
  feed: F;
}

export interface FeedByIdOptions<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> extends InnerFeedOptions<FeedOptions<T, R>>, WithId {
}

export interface FeedByIdOptionsSummary<T extends FeedType = FeedType> extends InnerFeedOptions<FeedOptionsSummary<T>>, WithId {
}

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
