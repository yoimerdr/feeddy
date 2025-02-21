import {rawAll, rawById, rawGet} from "./raw";
import {rawBlogEntryToBlogEntry, rawBlogToBlog} from "../shared/converters";
import {
  FeedByIdOptions,
  FeedByIdOptionsSummary,
  FeedOptions,
  FeedOptionsSummary,
  FeedRoute,
  FeedType
} from "../types/feeds/options";
import {ByIdResult, Result} from "../types/feeds";
import {KeyableObject} from "../../lib/jstls/src/types/core/objects";
import {get as prop} from "../../lib/jstls/src/core/objects/handlers/getset";

export function all<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<Result<T, R>>;
export function all<T extends FeedType = FeedType>(options: FeedOptionsSummary<T>): Promise<Result<T, "summary">>;
export function all(options: FeedOptions | FeedOptionsSummary): Promise<KeyableObject> {
  return rawAll(options)
    .then(rawBlogToBlog);
}

export function get<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<Result<T, R>>;
export function get<T extends FeedType = FeedType>(options: FeedOptionsSummary<T>): Promise<Result<T, "summary">>;
export function get(options: FeedOptions | FeedOptionsSummary): Promise<KeyableObject> {
  return rawGet(options)
    .then(rawBlogToBlog);
}

export function byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<ByIdResult<T, "summary">>;
export function byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<ByIdResult<T, R>>;
export function byId(options: FeedByIdOptions | FeedByIdOptionsSummary): Promise<KeyableObject> {
  const mapper: any = prop(options, "feed", "type") === "comments" ? rawBlogToBlog : rawBlogEntryToBlogEntry;
  return rawById(options)
    .then(mapper)
}
