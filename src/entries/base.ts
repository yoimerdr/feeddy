import {EntriesHandler, EntriesSimpleOptions} from "@feeddy/types/entries";
import {getIf} from "@jstls/core/objects/validators";
import {BaseFeedOptions} from "@feeddy/types/feeds/options";
import {isObject} from "@jstls/core/objects/types";
import {self} from "@jstls/core/definer/getters/builders";
import {builderFrom, paramsFrom, SearchParams, SearchParamsBuilder} from "@feeddy/search";
import {isComments} from "@feeddy/shared";
import {_rawGet} from "@feeddy/feeds/raw";
import {rawBlogToBlog} from "@feeddy/shared/converters";
import {all, get} from "@feeddy/feeds";
import {KeyableObject} from "@jstls/types/core/objects";
import {BaseBlog} from "@feeddy/types/feeds/entry";

export type EntriesHandlerBuilder = (feed: BaseFeedOptions, params: SearchParams, builder: SearchParamsBuilder, request: (feed: BaseFeedOptions) => Promise<BaseBlog>) => (blog: BaseBlog) => EntriesHandler

export function entriesBase<R = KeyableObject>(options: EntriesSimpleOptions,
                                               builder: EntriesHandlerBuilder, id?: string): Promise<EntriesHandler & R> {

  options = getIf(options, isObject, self, {},);
  let feed: BaseFeedOptions;
  options.feed = feed = getIf(options.feed, isObject, self, {}) as BaseFeedOptions;
  const params = paramsFrom(feed.params),
    paramsBuilder = builderFrom(params);

  const request = isComments(feed) && id ? function (feed: BaseFeedOptions) {
      return _rawGet(feed as BaseFeedOptions<"comments">, params.query() as any, id)
        .then(rawBlogToBlog);
    } : get,
    createHandler = builder(feed, params, paramsBuilder, request);


  params.query() || params.max(1)

  return (id && isComments(feed) ? request : (params.query() ? all : get))(feed)
    .then(createHandler) as Promise<EntriesHandler & R>;
}
