import {RawBlog, RawBlogSummary, RawPostEntry} from "../../types/feeds/raw";
import {FeedOptions, FeedOptionsFull, FeedOptionsSummary} from "../../types/feeds/shared";
import {buildUrl} from "../../shared";
import {SearchParams, SearchParamsBuilder} from "../../search";
import {getDefined} from "../../../lib/jstls/src/core/objects/validators";
import {deepAssign} from "../../../lib/jstls/src/core/objects/factory";

function _rawGet(options: Partial<FeedOptions>, all?: boolean): Promise<RawBlog> {
  options = feedOptions(options);
  const params = SearchParams.from(options.params);

  if (all) {
    params.start(1);
    params.max(SearchParamsBuilder.maxResults);
  }

  const entries: RawPostEntry[] = [];
  const url = buildUrl(options);
  const startIndex = params.start();

  function request(url: string | URL, max: number): Promise<RawBlog> {
    return fetch(url)
      .then(res => res.json())
      .then((blog: RawBlog) => {
        const entry = getDefined(blog.feed.entry, () => []);
        const feed = blog.feed;
        entries.extends(entry);
        if (entry.isNotEmpty() && entry.length >= SearchParamsBuilder.maxResults && ((all && entry.length >= SearchParamsBuilder.maxResults) || (!all && entry.length < max))) {
          if (!all)
            max -= entry.length;
          params.start(params.start() + entry.length)
          params.max(max);
          return request(buildUrl(options), max);
        }
        feed.entry = entries;
        if (params.max() !== entries.length)
          feed.openSearch$itemsPerPage.$t = feed.openSearch$totalResults.$t = entries.length.toString();
        feed.openSearch$startIndex.$t = startIndex.toString();
        return blog;
      });
  }

  return request(url, params.max())
}

export function feedOptions(options: Partial<FeedOptions>): FeedOptions {
  return deepAssign(<FeedOptions>{
    route: 'summary',
    params: {
      "max-results": 1
    }
  }, options);
}

export function rawGet(options: Partial<FeedOptionsFull>): Promise<RawBlog>;
export function rawGet(options: Partial<FeedOptionsSummary>): Promise<RawBlogSummary>;
export function rawGet(options: Partial<FeedOptions>): Promise<RawBlog>;
export function rawGet(options: Partial<FeedOptions>): Promise<RawBlog> {
  return _rawGet(options);
}

export function rawAll(options: Partial<FeedOptionsFull>): Promise<RawBlog>;
export function rawAll(options: Partial<FeedOptionsSummary>): Promise<RawBlogSummary>;
export function rawAll(options: Partial<FeedOptions>): Promise<RawBlog>;
export function rawAll(options: Partial<FeedOptions>): Promise<RawBlog> {
  return _rawGet(options, true);
}
