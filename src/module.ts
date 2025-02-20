import {rawAll, rawById, rawGet} from "./feeds/raw";
import {all, byId, get} from "./feeds";
import {paramsBuilder, SearchParamsBuilder} from "./search";
import {buildUrl, getId} from "./shared";
import {Routes} from "./types/feeds/shared";
import {postById, posts,} from "./posts";
import {readonly2} from "../lib/jstls/src/core/definer";
import {Feed} from "./types/feeds";
import {Posts} from "./types/posts";
import {queryBuilder, QueryStringBuilder} from "./search/query/builder";
import {Search} from "./types/search";
import {postThumbnail} from "./posts/converters";
import {withCategories} from "./posts/related";
import {entries} from "./entries";
import {Entries} from "./types/entries";

readonly2(rawGet, "all", rawAll);
readonly2(rawGet, "byId", rawById);

/**
 * The handler to make requests to the blogger feed API.
 */
export const feed = <Feed>get;
readonly2(feed, "all", all);
readonly2(feed, "raw", rawGet);
readonly2(feed, "byId", byId);

/*

 */

readonly2(entries, "byId", byId);


/**
 * The handler for search on blogger feed.
 */
export const search = <Search>{
  query: queryBuilder,
  QueryStringBuilder,
  params: paramsBuilder,
  SearchParamsBuilder
}
/**
 *
 */
readonly2(<Posts>posts, "createsThumbnail", postThumbnail);
readonly2(<Posts>posts, "withCategories", withCategories);
readonly2(posts, "byId", postById);

interface Feeddy {
  buildUrl: typeof buildUrl;
  routes: Routes;
  feed: Feed;
  search: Search;
  posts: Posts;
  entries: Entries;
  getId: typeof getId;
}

export * from "./shared";
export {routes} from "./shared/routes";

export {posts, entries}

