import {EntriesHandler, EntriesSimpleOptions} from "@/types/entries";
import {getIf} from "@jstls/core/objects/validators";
import {BaseFeedOptions} from "@/types/feeds/options";
import {isObject} from "@jstls/core/objects/types";
import {self} from "@jstls/core/definer/getters/builders";
import {builderFrom, paramsFrom, SearchParams, SearchParamsBuilder} from "@/search";
import {isComments} from "@/shared";
import {_rawGet} from "@/feeds/raw";
import {rawBlogToBlog} from "@/shared/converters";
import {all, get} from "@/feeds";
import {KeyableObject} from "@jstls/types/core/objects";
import {BaseBlog} from "@/types/feeds/entry";

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
