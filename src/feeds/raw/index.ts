import {RawBlog, RawBlogSummary, RawPostEntry} from "../../types/feeds/raw";
import {FeedOptions, FeedOptionsFull, FeedOptionsSummary} from "../../types/feeds/shared";
import {buildUrl} from "../../shared";
import {SearchParams, SearchParamsBuilder} from "../../search";
import {getDefined} from "../../../lib/jstls/src/core/objects/validators";
import {deepAssign} from "../../../lib/jstls/src/core/objects/factory";
import {apply} from "../../../lib/jstls/src/core/functions/apply";
import {extend} from "../../../lib/jstls/src/core/extensions/array";
import {isNotEmpty} from "../../../lib/jstls/src/core/extensions/shared/iterables";
import {string} from "../../../lib/jstls/src/core/objects/handlers";

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
        const {feed} = blog;
        const entry = getDefined(feed.entry, () => []);

        apply(extend<RawPostEntry>, entries, [entry])

        const {length} = entry;
        const {maxResults} = SearchParamsBuilder;

        if (apply(isNotEmpty, entry) && length >= maxResults && ((all && length >= maxResults) || (!all && length < max))) {
          if (!all)
            max -= length;
          params.start(params.start() + length)
          params.max(max);
          return request(buildUrl(options), max);
        }
        feed.entry = entries;
        if (params.max() !== entries.length)
          feed.openSearch$itemsPerPage.$t = feed.openSearch$totalResults.$t = string(entries.length);
        feed.openSearch$startIndex.$t = string(startIndex);
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
