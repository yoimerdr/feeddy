import {SearchParams, SearchParamsBuilder} from "@feeddy/search";
import {BaseBlog} from "@feeddy/types/feeds/entry";
import {EntriesHandler, EntriesHandlerSimpleExtra} from "@feeddy/types/entries";
import {freeze} from "@jstls/core/shortcuts/object";
import {assign2} from "@jstls/core/objects/factory";
import {KeyableObject} from "@jstls/types/core/objects";
import {deletes} from "@jstls/core/objects/handlers/deletes";
import {EntriesHandlerBuilder} from "@feeddy/entries/base";
import {getty} from "@feeddy/shared/shortnames";
import {BaseFeedOptions} from "@feeddy/types/feeds/options";

export type EntriesHandlerRequest = (feed: BaseFeedOptions) => Promise<BaseBlog>;
export type EntriesHandlerPageBuilder = (options: BaseFeedOptions, params: SearchParams, builder: SearchParamsBuilder, request: EntriesHandlerRequest) => (page: number) => Promise<any>;

export function basicHandler<R = KeyableObject>(changePage: EntriesHandlerPageBuilder,
                                                fn?: EntriesHandlerSimpleExtra<any, any>): EntriesHandlerBuilder {
  return function (options, params, builder, request) {
    const max = params.max();
    return (blog) => {
      builder.max(max);
      const source = fn ? fn(blog) : {} as R,
        handler = freeze(assign2(source as KeyableObject, {
          total: blog.feed.openSearch$totalResults,
          page: changePage(options, params, builder, request)
        }));
      deletes(blog, "feed");
      return handler as any;
    }
  }
}

export function basicHandlerPage(feed: BaseFeedOptions, _: SearchParams, builder: SearchParamsBuilder, request: EntriesHandlerRequest): (page: number, reverse?: boolean) => Promise<any> {
  return function (this: EntriesHandler, page, reverse) {
    reverse ? builder.repage(this.total, page) : builder.page(page);

    feed.params = builder
      .build();

    return request(feed)
      .then(blog => {
        const entries: any[] = getty(blog, "feed", "entry") || [];

        reverse && entries.reverse();
        return freeze({
          entries,
          blog
        })
      });
  }
}
