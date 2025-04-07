import {buildUrl, isComments} from "../../shared";
import {maxResults, paramsFrom} from "../../search";
import {assign2} from "../../../lib/jstls/src/core/objects/factory";
import {extend} from "../../../lib/jstls/src/core/extensions/array";
import {isNotEmpty} from "../../../lib/jstls/src/core/extensions/shared/iterables";
import {string} from "../../../lib/jstls/src/core/objects/handlers";
import {len} from "../../../lib/jstls/src/core/shortcuts/indexable";
import {
  BaseFeedOptions,
  FeedByIdOptions,
  FeedByIdOptionsSummary,
  FeedOptions,
  FeedOptionsSummary,
  FeedRoute,
  FeedType
} from "../../types/feeds/options";
import {RawByIdResult, RawResult} from "../../types/feeds/raw";
import {RawBaseBlog, RawBaseEntry} from "../../types/feeds/raw/entry";
import {IllegalAccessError,} from "../../../lib/jstls/src/core/exceptions";
import {get, set} from "../../../lib/jstls/src/core/objects/handlers/getset";
import {KeyableObject} from "../../../lib/jstls/src/types/core/objects";


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
    startIndex = params.start();

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

          if (isNotEmpty(entry) && length >= maxResults && ((all && length >= maxResults) || (!all && length < max))) {
            if (!all)
              max -= length;
            params.start(params.start() + length)
            params.max(max);
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
export function rawGet<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R> | FeedOptionsSummary): Promise<RawResult> {
  return _rawGet(options);
}

export function rawAll<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<RawResult<T, R>>;
export function rawAll<T extends FeedType = FeedType>(options: FeedOptionsSummary<T>): Promise<RawResult<T, "summary">>;
export function rawAll(options: FeedOptions | FeedOptionsSummary): Promise<RawResult> {
  return _rawGet(options, true);
}

export function rawById<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<RawByIdResult<T, R>>;
export function rawById<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<RawByIdResult<T, "summary">>;
export function rawById(options: FeedByIdOptions | FeedByIdOptionsSummary): Promise<RawByIdResult> {
  return _rawGet(get(options, "feed") || {}, false, get(options, "id"));
}
