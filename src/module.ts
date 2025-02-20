import {rawAll, rawGet} from "./feeds/raw";
import {all, get} from "./feeds";
import {paramsBuilder, SearchParamsBuilder} from "./search";
import {buildUrl} from "./shared";
import {Routes} from "./types/feeds/shared";
import {posts, } from "./posts";
import {readonly} from "../lib/jstls/src/core/definer";
import {Feed} from "./types/feeds";
import {Posts} from "./types/posts";
import {queryBuilder, QueryStringBuilder} from "./search/query/builder";
import {Search} from "./types/search";
import {postThumbnail} from "./posts/converters";
import {withCategories} from "./posts/related";

readonly(rawGet, "all", rawAll);

/**
 * The handler to make requests to the blogger feed API.
 */
export const feed = <Feed>get;
readonly(feed, "all", all);
readonly(feed, "raw", rawGet);

/**
 * The handler for search on blogger feed.
 */
export const search = <Search> {
  query: queryBuilder,
  QueryStringBuilder,
  params: paramsBuilder,
  SearchParamsBuilder
}

readonly(<Posts>posts, "createsThumbnail", postThumbnail);
readonly(<Posts>posts, "withCategories", withCategories);

interface Feeddy {
  buildUrl: typeof buildUrl;
  routes: Routes;
  feed: Feed;
  search: Search;
  posts: Posts;
}

export * from "./shared";

export {posts}

