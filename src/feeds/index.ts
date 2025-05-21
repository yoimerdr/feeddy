import {rawAll, rawById, rawGet} from "@/feeds/raw";
import {rawBlogEntryToBlogEntry, rawBlogToBlog} from "@/shared/converters";
import {
  FeedByIdOptions,
  FeedByIdOptionsSummary,
  FeedOptions,
  FeedOptionsSummary,
  FeedRoute,
  FeedType
} from "@/types/feeds/options";
import {ByIdResult, Result} from "@/types/feeds";
import {KeyableObject} from "@jstls/types/core/objects";
import {getty} from "@/shared/shortnames";
import {
  ByIdPostResult, ByIdPostResultSummary,
  ByIdPostsOptions,
  ByIdPostsOptionsSummary,
  PostsFeedOptions, PostsFeedOptionsSummary,
  PostsResult,
  PostsResultSummary
} from "@/types/posts";

export function all<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<Result<T, R>>;
export function all<T extends FeedType = FeedType>(options: FeedOptionsSummary<T>): Promise<Result<T, "summary">>;
export function all<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions<R>): Promise<PostsResult<R>>;
export function all(options: PostsFeedOptionsSummary): Promise<PostsResultSummary>;
export function all(options: any): Promise<KeyableObject> {
  return rawAll(options)
    .then(rawBlogToBlog);
}

export function get<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<Result<T, R>>;
export function get<T extends FeedType = FeedType>(options: FeedOptionsSummary<T>): Promise<Result<T, "summary">>;
export function get<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions<R>): Promise<PostsResult<R>>;
export function get(options: PostsFeedOptionsSummary): Promise<PostsResultSummary>;
export function get(options: any): Promise<KeyableObject> {
  return rawGet(options)
    .then(rawBlogToBlog);
}

export function byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<ByIdResult<T, "summary">>;
export function byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<ByIdResult<T, R>>;
export function byId<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<ByIdPostResult<R>>;
export function byId(options: ByIdPostsOptionsSummary): Promise<ByIdPostResultSummary>;
export function byId(options: any): Promise<KeyableObject> {
  const mapper: any = getty(options, "feed", "type") === "comments" ? rawBlogToBlog : rawBlogEntryToBlogEntry;
  return rawById(options)
    .then(mapper)
}
