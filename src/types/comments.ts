import {
  FeedByIdOptions,
  FeedOptions,
  FeedRoute,
  InnerFeedOptions
} from "./feeds/options";
import {ByIdResult} from "./feeds";
import {EntriesHandler,} from "./entries";

export interface CommentsHandler<R extends FeedRoute = FeedRoute> extends EntriesHandler<"comments", R> {
}

export type CommentsFeedOptions<R extends FeedRoute = FeedRoute> = Omit<FeedOptions<"comments", R>, "type">
export type CommentsFeedOptionsSummary = Omit<CommentsFeedOptions, "route">;

export type CommentsOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<CommentsFeedOptions<R>>;
export type CommentsOptionsSummary = InnerFeedOptions<CommentsFeedOptionsSummary>;

export type ByIdCommentsOptions<R extends FeedRoute = FeedRoute> = FeedByIdOptions<"comments", R>;
export type ByIdCommentsOptionsSummary = FeedByIdOptions<"comments", "summary">;

export interface Comments {
  <R extends FeedRoute = FeedRoute>(options: CommentsOptions<R>): Promise<CommentsHandler<R>>;

  (options: CommentsOptionsSummary): Promise<CommentsHandler<"summary">>;

  byId<R extends FeedRoute = FeedRoute>(options: ByIdCommentsOptions<R>): Promise<ByIdResult<"comments", R>>;

  byId(options: ByIdCommentsOptionsSummary): Promise<ByIdResult<"comments", "summary">>;
}
