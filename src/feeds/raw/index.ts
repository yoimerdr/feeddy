import {buildUrl} from "../../shared";
import {maxResults, paramsFrom} from "../../search";
import {requireObject} from "../../../lib/jstls/src/core/objects/validators";
import {deepAssign} from "../../../lib/jstls/src/core/objects/factory";
import {apply} from "../../../lib/jstls/src/core/functions/apply";
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


function _rawGet(options: Partial<BaseFeedOptions>,): Promise<RawResult>;
function _rawGet(options: Partial<BaseFeedOptions>, all: boolean): Promise<RawResult>;
function _rawGet(options: Partial<BaseFeedOptions>, all: boolean, id: string): Promise<RawByIdResult>;
function _rawGet(options: Partial<BaseFeedOptions>, all?: boolean, id?: string): Promise<RawResult | RawByIdResult> {
  options = feedOptions(options);
  const params = paramsFrom(options.params);

  if (all) {
    params.start(1);
    params.max(maxResults);
  }

  const entries: RawBaseEntry[] = [];
  const url = buildUrl(options, id);
  const startIndex = params.start();

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
          if (id) {
            return blog;
          }
          const {feed} = blog;
          const entry = feed.entry || [];

          apply(extend<RawBaseEntry>, entries, [entry])

          const length = len(entry);

          if (apply(isNotEmpty, entry) && length >= maxResults && ((all && length >= maxResults) || (!all && length < max))) {
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
  return deepAssign(<BaseFeedOptions>{
    route: 'summary',
    params: {
      "max-results": 1
    }
  }, options);
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
  requireObject(options, "options")
  return _rawGet(options.feed || {}, false, options.id);
}
