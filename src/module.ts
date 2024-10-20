import {rawAll, rawGet} from "./feeds/raw";
import {all, get} from "./feeds";
import {paramsBuilder, SearchParamsBuilder} from "./search";
import {buildUrl} from "./shared";
import {Routes} from "./types/feeds/shared";
import {posts, postThumbnail, withCategories} from "./posts";
import {readonlys} from "../lib/jstls/src/core/definer";
import {RawFeed} from "./types/feeds/raw";
import {Feed} from "./types/feeds";
import {Posts} from "./types/posts";
import {queryBuilder, QueryStringBuilder} from "./search/query/builder";
import {Search} from "./types/search";

readonlys(<RawFeed>rawGet, {
  all: rawAll
})

/**
 * The handler to make requests to the blogger feed API.
 */
export const feed = <Feed>get;
readonlys(feed, {
  all,
  raw: rawGet,
});

/**
 * The handler for search on blogger feed.
 */
export const search = <Search> {
  query: queryBuilder,
  QueryStringBuilder,
  params: paramsBuilder,
  SearchParamsBuilder
}

readonlys(<Posts>posts, {
  createsThumbnail: postThumbnail,
  withCategories
})


interface Feeddy {
  buildUrl: typeof buildUrl;
  routes: Routes;
  feed: Feed;
  search: Search;
  posts: Posts;
}

export * from "./shared";

export {posts}

