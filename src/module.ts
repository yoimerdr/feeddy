import {rawAll, rawById, rawGet} from "./feeds/raw";
import {all, byId, get} from "./feeds";
import {paramsBuilder, SearchParams, SearchParamsBuilder} from "./search";
import {buildUrl, getId} from "./shared";
import {Routes} from "./types/feeds/shared";
import {posts,} from "./posts";
import {readonly2} from "../lib/jstls/src/core/definer";
import {Feed} from "./types/feeds";
import {Posts} from "./types/posts";
import {queryBuilder, QueryStringBuilder} from "./search/query/builder";
import {Search} from "./types/search";
import {postThumbnail} from "./posts/converters";
import {withCategories} from "./posts/related";
import {entries} from "./entries";
import {Entries, EntriesOptions} from "./types/entries";
import {routes} from "./shared/routes";
import {KeyableObject} from "../lib/jstls/src/types/core/objects";
import {set} from "../lib/jstls/src/core/objects/handlers/getset";
import {FeedByIdOptions} from "./types/feeds/options";
import {forEach} from "../lib/jstls/src/core/shortcuts/array";
import {assign} from "../lib/jstls/src/core/objects/factory";
import {Comments} from "./types/comments";
import {Pages} from "./types/pages";
import {commentsById} from "./comments";

interface Feeddy {
  buildUrl: typeof buildUrl;
  getId: typeof getId;
  routes: Routes;
  feed: Feed;
  search: Search;
  posts: Posts;
  entries: Entries;
  comments: Comments,
  pages: Pages
}

/**
 * Define the sub handler for the raw feed.
 */
readonly2(rawGet, "all", rawAll);
readonly2(rawGet, "byId", rawById);

/**
 * The handler to make requests to the blogger feed API.
 */
const feed = <Feed>get;

/**
 * Define the sub handler for the mapped feed.
 */
readonly2(feed, "all", all);
readonly2(feed, "raw", rawGet);
readonly2(feed, "byId", byId);

/**
 * The handler for search on blogger feed.
 */
const search = <Search>{
  query: queryBuilder,
  QueryStringBuilder,
  params: paramsBuilder,
  SearchParamsBuilder,
  SearchParams
}

/**
 * Define the sub handlers for entries.
 */
readonly2(entries, "byId", byId);

/**
 * Define the sub handlers for posts.
 */
readonly2(<Posts>posts, "createsThumbnail", postThumbnail);
readonly2(<Posts>posts, "withCategories", withCategories);

/**
 * The exports object.
 */
const module = {
  posts: <Posts>posts,
  entries: <Entries>entries,
  search,
  feed,
  routes,
  buildUrl,
  getId,
} as Feeddy;

/**
 * Define the handlers for specific entry feeds
 */
const others = ["comments", "pages"];
forEach(others, key => {
  set(module, key, function (options: EntriesOptions) {
    set(options, "feed", "type", key);
    return entries(options);
  })
})

/**
 * Define the sub handlers for specific entry feeds
 */
others.push("posts");
forEach(others, key => {
  set(module, key, "byId", function (options: FeedByIdOptions) {
    set(options, "feed", "type", key);
    return byId(options);
  })
})

/**
 * Redefine the sub handlers for comments
 */

set(module, "comments", "byId", commentsById);

declare const exports: KeyableObject;

/**
 * Assign the exports
 */
assign(exports, module);

export {
  feed
}
