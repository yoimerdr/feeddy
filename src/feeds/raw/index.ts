import {buildUrl, isComments} from "@feeddy/shared";
import {maxResults, paramsFrom} from "@feeddy/search";
import {assign2} from "@jstls/core/objects/factory";
import {extend} from "@jstls/core/extensions/array";
import {isNotEmpty} from "@jstls/core/extensions/shared/iterables";
import {string} from "@jstls/core/objects/handlers";
import {len} from "@jstls/core/shortcuts/indexable";
import {
  BaseFeedOptions,
  FeedByIdOptions,
  FeedByIdOptionsSummary,
  FeedOptions,
  FeedOptionsSummary,
  FeedRoute,
  FeedType
} from "@feeddy/types/feeds/options";
import {RawByIdResult, RawResult} from "@feeddy/types/feeds/raw";
import {RawBaseBlog, RawBaseEntry} from "@feeddy/types/feeds/raw/entry";
import {IllegalAccessError,} from "@jstls/core/exceptions/illegal-access";
import {get, set} from "@jstls/core/objects/handlers/getset";
import {KeyableObject} from "@jstls/types/core/objects";
import {
  ByIdPostsOptions, ByIdPostsOptionsSummary,
  PostsFeedOptions,
  PostsFeedOptionsSummary,
} from "@feeddy/types/posts";
import {
  RawByIdPostResult,
  RawByIdPostResultSummary,
  RawPostsResult,
  RawPostsResultSummary
} from "@feeddy/types/feeds/raw/posts";


export function _rawGet<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: Partial<BaseFeedOptions<T, R>>,): Promise<RawResult>;
export function _rawGet<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: Partial<BaseFeedOptions<T, R>>, all: boolean): Promise<RawResult<T, R>>;
export function _rawGet<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: Partial<BaseFeedOptions<T, R>>, all: boolean, id: string): Promise<RawByIdResult<T, R>>;
export function _rawGet(options: Partial<BaseFeedOptions>, all?: boolean, id?: string): Promise<RawResult | RawByIdResult> {
  options = feedOptions(options);
  const params = paramsFrom(options.params);

  if (all) {
    params.start(1);
    params.max(maxResults);
  }

  const entries: RawBaseEntry[] = [],
    url = buildUrl(options, id),
    startIndex = params.start() || 1;

  function request(url: string | URL, max: number): Promise<RawBaseBlog> {
    return fetch(string(url))
      .then(res => {
        if (res.status !== 200)
          throw new IllegalAccessError("Request failed. Status: " + res.status);
        return res.text();
      })
      .then(body => {
        try {
          const blog: RawBaseBlog = JSON.parse(body);
          if (id && !isComments(options)) {
            return blog;
          }
          const {feed} = blog,
            entry = feed.entry || [];

          extend(entry, entries);

          const length = len(entry);
          if (isNotEmpty(entry) && (all || (!all && length < max))) {
            !all && (max -= length);
            params.start(params.start() + length)
            params.max(max);
            if (max > 0)
              return request(buildUrl(options), max);
          }
          feed.entry = entries;
          if (params.max() !== len(entries))
            feed.openSearch$itemsPerPage.$t = feed.openSearch$totalResults.$t = string(len(entries));
          feed.openSearch$startIndex.$t = string(startIndex);
          return blog;
        } catch (e) {
          throw {
            message: "Parse failed. The response is not a JSON.",
            body,
          };
        }
      });
  }

  return request(url, params.max())
}

export function feedOptions(options: Partial<BaseFeedOptions>): BaseFeedOptions {
  const result = assign2(<BaseFeedOptions>{
      route: "summary",
      type: "posts",
    }, options),
    key = "params",
    max = "max-results",
    params: KeyableObject = {};
  params[max] = 1;
  set(result, key, assign2(params, get(options, key)!))
  return result;
}

export function rawGet<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<RawResult<T, R>>;
export function rawGet<T extends FeedType = FeedType>(options: FeedOptionsSummary<T>): Promise<RawResult<T, "summary">>;
export function rawGet<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions<R>): Promise<RawPostsResult<R>>;
export function rawGet(options: PostsFeedOptionsSummary): Promise<RawPostsResultSummary>;
export function rawGet(options: any): Promise<RawResult> {
  return _rawGet(options);
}

export function rawAll<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<RawResult<T, R>>;
export function rawAll<T extends FeedType = FeedType>(options: FeedOptionsSummary<T>): Promise<RawResult<T, "summary">>;
export function rawAll<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions<R>): Promise<RawPostsResult<R>>;
export function rawAll(options: PostsFeedOptionsSummary): Promise<RawPostsResultSummary>;
export function rawAll(options: any): Promise<RawResult> {
  return _rawGet(options, true);
}

export function rawById<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<RawByIdResult<T, R>>;
export function rawById<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<RawByIdResult<T, "summary">>;
export function rawById<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<RawByIdPostResult<R>>;
export function rawById(options: ByIdPostsOptionsSummary): Promise<RawByIdPostResultSummary>;
export function rawById(options: any): Promise<RawByIdResult> {
  return _rawGet(get(options, "feed") || {}, false, get(options, "id"));
}
