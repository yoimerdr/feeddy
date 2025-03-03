import {
  FeedOptions,
  FeedRoute,
  InnerFeedOptions
} from "./feeds/options";
import {EntriesHandler,} from "./entries";
import {WithId} from "./index";

export interface CommentsHandler<R extends FeedRoute = FeedRoute> extends EntriesHandler<"comments", R> {
}

export type CommentsFeedOptions<R extends FeedRoute = FeedRoute> = Omit<FeedOptions<"comments", R>, "type">
export type CommentsFeedOptionsSummary = Omit<CommentsFeedOptions, "route">;

export type CommentsOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<CommentsFeedOptions<R>>;
export type CommentsOptionsSummary = InnerFeedOptions<CommentsFeedOptionsSummary>;

export type ByIdCommentsOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<CommentsFeedOptions<R>> & WithId;
export type ByIdCommentsOptionsSummary = InnerFeedOptions<CommentsFeedOptionsSummary> & WithId;

export interface Comments {
  <R extends FeedRoute = FeedRoute>(options: CommentsOptions<R>): Promise<CommentsHandler<R>>;

  (options: CommentsOptionsSummary): Promise<CommentsHandler<"summary">>;

  byId<R extends FeedRoute = FeedRoute, >(options: ByIdCommentsOptions<R>): Promise<CommentsHandler<R>>;

  byId(options: ByIdCommentsOptionsSummary): Promise<CommentsHandler<"summary">>;
}
