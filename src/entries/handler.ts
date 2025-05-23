import {BaseFeedOptions} from "@/types/feeds/options";
import {SearchParams, SearchParamsBuilder} from "@/search";
import {BaseBlog} from "@/types/feeds/entry";
import {EntriesHandlerSimpleExtra} from "@/types/entries";
import {freeze} from "@jstls/core/shortcuts/object";
import {assign2} from "@jstls/core/objects/factory";
import {KeyableObject} from "@jstls/types/core/objects";
import {deletes} from "@jstls/core/objects/handlers/deletes";
import {EntriesHandlerBuilder} from "@/entries/base";
import {getty} from "@/shared/shortnames";

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

export function basicHandlerPage(feed: BaseFeedOptions, params: SearchParams, builder: SearchParamsBuilder, request: EntriesHandlerRequest): (page: number) => Promise<any> {
  return (page) => {
    feed.params = builder
      .paginated(page)
      .build();

    return request(feed)
      .then(blog => freeze({
        entries: getty(blog, "feed", "entry") || [],
        blog
      }));
  }
}
