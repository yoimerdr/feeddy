import {
  FeedByIdOptions,
  FeedOptions,
  FeedRoute,
  InnerFeedOptions
} from "./feeds/options";
import {ByIdResult} from "./feeds";
import {EntriesHandler,} from "./entries";

export interface PagesHandler<R extends FeedRoute = FeedRoute> extends EntriesHandler<"pages", R> {
}

export type PagesFeedOptions<R extends FeedRoute = FeedRoute> = Omit<FeedOptions<"pages", R>, "type">
export type PagesFeedOptionsSummary = Omit<PagesFeedOptions, "route">;

export type PagesOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<PagesFeedOptions<R>>;
export type PagesOptionsSummary = InnerFeedOptions<PagesFeedOptionsSummary>;

export type ByIdPagesOptions<R extends FeedRoute = FeedRoute> = FeedByIdOptions<"pages", R>;
export type ByIdPagesOptionsSummary = FeedByIdOptions<"pages", "summary">;

export interface Pages {
  <R extends FeedRoute = FeedRoute>(options: PagesOptions<R>): Promise<PagesHandler<R>>;

  (options: PagesOptionsSummary): Promise<PagesHandler<"summary">>;

  byId<R extends FeedRoute = FeedRoute>(options: ByIdPagesOptions<R>): Promise<ByIdResult<"pages", R>>;

  byId(options: ByIdPagesOptionsSummary): Promise<ByIdResult<"pages", "summary">>;
}
