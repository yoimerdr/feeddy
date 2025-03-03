import {BaseFeedOptions, FeedRoute, FeedType,} from "../types/feeds/options";
import {KeyableObject} from "../../lib/jstls/src/types/core/objects";
import {getIf, requireObject} from "../../lib/jstls/src/core/objects/validators";
import {isObject} from "../../lib/jstls/src/core/objects/types";
import {builderFrom, paramsFrom} from "../search";
import {all, get} from "../feeds";
import {freeze} from "../../lib/jstls/src/core/shortcuts/object";
import {assign, create} from "../../lib/jstls/src/core/objects/factory";
import {
  EntriesHandler,
  EntriesHandlerExtra, EntriesHandlerSimpleExtra,
  EntriesOptions,
  EntriesOptionsSummary,
  EntriesSimpleOptions,
} from "../types/entries";
import {BaseBlog} from "../types/feeds/entry";
import {_rawGet} from "../feeds/raw";
import {rawBlogToBlog} from "../shared/converters";
import {isComments} from "../shared";
import {getty} from "../shared/shortnames";

export function entries2<B extends BaseBlog, R = KeyableObject>(options: EntriesSimpleOptions,
                                                                fn?: EntriesHandlerSimpleExtra<B, R>, id?: string): Promise<EntriesHandler & R> {
  requireObject(options, "options");
  let feed: BaseFeedOptions;
  options.feed = feed = getIf(options.feed as BaseFeedOptions, isObject, create) as BaseFeedOptions;
  const params = paramsFrom(feed.params), max = params.max();
  const builder = builderFrom(params);

  function changePage(this: KeyableObject, page: number) {
    feed.params = builder
      .paginated(page)
      .build();

    return get(feed)
      .then(blog => freeze({
        entries: getty(blog, "feed", "entry") || [],
        blog
      }));
  }

  function createHandler(blog: BaseBlog) {
    builder.max(max);
    const source = fn ? fn(blog as B) : {} as R;
    const handler = freeze(assign(source as KeyableObject, {
      total: blog.feed.openSearch$totalResults,
      page: changePage
    }));
    delete (blog as KeyableObject).feed;
    return handler as any;
  }

  if (!params.query())
    params.max(1)

  if (id && isComments(feed))
    return _rawGet(feed as BaseFeedOptions<"comments">, params.query() as any, id)
      .then(rawBlogToBlog)
      .then(createHandler);

  return (params.query() ? all : get)(feed)
    .then(createHandler)
}

export function entries<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: EntriesOptions<T, R>): Promise<EntriesHandler<T, R>>;
export function entries<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute, E = KeyableObject>(options: EntriesOptions<T, R>, xtra: EntriesHandlerExtra<T, R, E>): Promise<EntriesHandler<T, R> & E>;
export function entries<T extends FeedType = FeedType>(options: EntriesOptionsSummary<T>): Promise<EntriesHandler<T, "summary">>;
export function entries<T extends FeedType = FeedType, E = KeyableObject>(options: EntriesOptionsSummary<T>, extra: EntriesHandlerExtra<T, "summary", E>): Promise<EntriesHandler<T, "summary"> & E>;
export function entries<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: EntriesOptions<T, R> | EntriesOptionsSummary<T>, extra?: EntriesHandlerExtra): Promise<KeyableObject> {
  return entries2<any>(options, extra);
}
