import {rawAll, rawGet} from "./feeds/raw";
import {all, get} from "./feeds";
import {paramsBuilder, SearchParamsBuilder} from "./search";
import {buildUrl} from "./shared";
import {Routes} from "./types/feeds/shared";
import {posts, postThumbnail, withCategories} from "./posts";
import {arrayExtensions, extend} from "../lib/jstls/src/core/extensions/array";
import {isEmpty, isNotEmpty} from "../lib/jstls/src/core/extensions/shared/iterables";
import {coerceAtLeast, coerceAtMost, coerceIn, numberExtensions} from "../lib/jstls/src/core/extensions/number";
import {stringExtensions, toInt} from "../lib/jstls/src/core/extensions/string";
import { readonlys } from "../lib/jstls/src/core/definer";
import {RawFeed} from "./types/feeds/raw";
import {Feed} from "./types/feeds";
import {Posts} from "./types/posts";
import {QueryStringBuilder, queryBuilder} from "./search/query/builder";

arrayExtensions({
  isEmpty,
  isNotEmpty,
  extends: extend,
});

numberExtensions({
  coerceIn,
  coerceAtLeast,
  coerceAtMost
})

stringExtensions({
  isEmpty,
  isNotEmpty,
  toInt
})

export interface Search {
  query: typeof queryBuilder;
  QueryStringBuilder: typeof QueryStringBuilder;
  params: typeof paramsBuilder;
  SearchParamsBuilder: typeof SearchParamsBuilder;
}

readonlys(<RawFeed>rawGet, {
  all: rawAll
})

export const feed = <Feed>get;
readonlys(feed, {
  all,
  raw: rawGet,
});

export const search: Search = {
  query: queryBuilder,
  QueryStringBuilder,
  params: paramsBuilder,
  SearchParamsBuilder
}

readonlys(<Posts>posts, {
  createsThumbnail: postThumbnail,
  withCategories
})


export interface Feeddy {
  buildUrl: typeof buildUrl;
  routes: Routes;
  feed: Feed;
  search: Search;
  posts: Posts;
}

export * from "./shared";

export {posts}

