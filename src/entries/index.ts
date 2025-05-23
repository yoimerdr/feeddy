import {FeedRoute, FeedType,} from "@/types/feeds/options";
import {KeyableObject} from "@jstls/types/core/objects";
import {
  EntriesHandler,
  EntriesHandlerExtra, EntriesOptions,
  EntriesOptionsSummary,
} from "@/types/entries";
import {PostsHandler, PostsOptions, PostsOptionsSummary} from "@/types/posts";
import {entriesBase} from "@/entries/base";
import {basicHandler, basicHandlerPage} from "@/entries/handler";

export function entries<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: EntriesOptions<T, R>): Promise<EntriesHandler<T, R>>;
export function entries<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute, E = KeyableObject>(options: EntriesOptions<T, R>, extra: EntriesHandlerExtra<T, R, E>): Promise<EntriesHandler<T, R> & E>;
export function entries<T extends FeedType = FeedType>(options: EntriesOptionsSummary<T>): Promise<EntriesHandler<T, "summary">>;
export function entries<T extends FeedType = FeedType, E = KeyableObject>(options: EntriesOptionsSummary<T>, extra: EntriesHandlerExtra<T, "summary", E>): Promise<EntriesHandler<T, "summary"> & E>;
export function entries<R extends FeedRoute = FeedRoute>(options: PostsOptions<R>): Promise<PostsHandler<R>>;
export function entries<R extends FeedRoute = FeedRoute, E = KeyableObject>(options: PostsOptions<R>, extra: EntriesHandlerExtra<"posts", R, E>): Promise<PostsHandler<R> & E>;
export function entries(options: PostsOptionsSummary): Promise<PostsHandler<"summary">>;
export function entries<E = KeyableObject>(options: PostsOptionsSummary, extra: EntriesHandlerExtra<"posts", "summary", E>): Promise<PostsHandler<"summary"> & E>;
export function entries(options: any, extra?: EntriesHandlerExtra): Promise<KeyableObject> {
  return entriesBase(options, basicHandler(basicHandlerPage, extra))
}
