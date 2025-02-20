import {BaseFeedOptions, FeedRoute, FeedType,} from "../types/feeds/options";
import {KeyableObject} from "../../lib/jstls/src/types/core/objects";
import {getIf, requireObject} from "../../lib/jstls/src/core/objects/validators";
import {isDefined, isObject} from "../../lib/jstls/src/core/objects/types";
import {builderFrom, paramsFrom} from "../search";
import {all, get} from "../feeds";
import {freeze} from "../../lib/jstls/src/core/shortcuts/object";
import {assign} from "../../lib/jstls/src/core/objects/factory";
import {EntriesHandler, EntriesOptions, EntriesOptionsSummary, EntriesSimpleOptions,} from "../types/entries";
import {BaseBlog} from "../types/feeds/entry";

export function entries2<B = BaseBlog, R = KeyableObject>(options: EntriesSimpleOptions, fn?: (blog: B) => KeyableObject): Promise<EntriesHandler & R> {
  requireObject(options, "options");
  let feed: BaseFeedOptions;
  options.feed = feed = getIf(options.feed as BaseFeedOptions, isObject, () => (<BaseFeedOptions>{}))
  const params = paramsFrom(feed.params), max = params.max();
  const builder = builderFrom(params);

  function changePage(this: KeyableObject, page: number) {
    feed.params = builder
      .paginated(page)
      .build();

    return get(feed)
      .then(blog => freeze({
        entries: isDefined(blog) ? blog!.feed.entry : [],
        blog
      }));
  }

  if (!params.query())
    params.max(1)

  return (params.query() ? all : get)(feed)
    .then(blog => {
      builder.max(max);
      let source = {} as R;
      if (fn)
        source = fn(blog as B);
      const handler = freeze(assign(source as KeyableObject, {
        total: blog.feed.openSearch$totalResults,
        page: changePage
      }));
      delete (blog as KeyableObject).feed;
      return handler as any;
    })
}

export function entries<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: EntriesOptions<T, R>): Promise<EntriesHandler<T, R>>;
export function entries<T extends FeedType = FeedType>(options: EntriesOptionsSummary<T>): Promise<EntriesHandler<T, "summary">>;
export function entries<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: EntriesOptions<T, R> | EntriesOptionsSummary<T>): Promise<EntriesHandler<T, R>> {
  return entries2(options);
}
