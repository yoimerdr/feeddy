import {rawAll, rawById, rawGet} from "@feeddy/feeds/raw";
import {all, byId, get} from "@feeddy/feeds";
import {paramsBuilder, SearchParams, SearchParamsBuilder} from "@feeddy/search";
import {buildUrl, getId} from "@feeddy/shared";
import {Routes} from "@feeddy/types/feeds/shared";
import {posts,} from "@feeddy/posts";
import {readonlys2} from "@jstls/core/definer";
import {FeedNamespace} from "./types/feeds";
import {PostsNamespace} from "./types/posts";
import {queryBuilder, QueryStringBuilder, splitQuery} from "./search/query";
import {SearchNamespace} from "./types/search";
import {postThumbnail} from "./posts/converters";
import {withCategories} from "./posts/related";
import {entries} from "./entries";
import {EntriesNamespace, EntriesOptions} from "./types/entries";
import {routes} from "./shared/routes";
import {KeyableObject} from "@jstls/types/core/objects";
import {set} from "@jstls/core/objects/handlers/getset";
import {FeedByIdOptions} from "./types/feeds/options";
import {forEach} from "@jstls/core/shortcuts/array";
import {assign2} from "@jstls/core/objects/factory";
import {CommentsNamespace} from "./types/comments";
import {PagesNamespace} from "./types/pages";
import {commentsById} from "./comments";
import {RawFeedNamespace} from "./types/feeds/raw";
import {entryPathname} from "./entries/shared";
import {ssrPosts} from "@feeddy/posts/ssr";
import {QueryNamespace} from "@feeddy/types/search/query";
import {ParamsNamespace} from "@feeddy/types/search/params";

interface Feeddy {
  buildUrl: typeof buildUrl;
  getId: typeof getId;
  routes: Routes;
  feed: FeedNamespace;
  search: SearchNamespace;
  posts: PostsNamespace;
  entries: EntriesNamespace;
  comments: CommentsNamespace,
  pages: PagesNamespace
}

/**
 * Define the sub handler for the raw feed.
 */
readonlys2(rawGet as RawFeedNamespace, {
  all: rawAll,
  byId: rawById,
})

/**
 * The handler to make mapped requests to the blogger feed API.
 */
const feed: FeedNamespace = get as any;

/**
 * Define the sub handler for the mapped feed.
 */
readonlys2(feed, {
  all,
  raw: rawGet,
  byId,
})

/**
 * The handler for search on blogger feed.
 */
const search = <SearchNamespace>{};
readonlys2(search, {
  query: queryBuilder,
  QueryStringBuilder,
  params: paramsBuilder,
  SearchParamsBuilder,
  SearchParams,
})

readonlys2(queryBuilder as QueryNamespace, {
  split: splitQuery,
  Builder: QueryStringBuilder,
})

readonlys2(paramsBuilder as ParamsNamespace, {
  Params: SearchParams,
  Builder: SearchParamsBuilder,
})

/**
 * Define the sub handlers for entries.
 */
readonlys2(entries as EntriesNamespace, {
  byId,
  createsPathname: entryPathname,
})

/**
 * Define the sub handlers for posts.
 */
readonlys2(posts as PostsNamespace, {
  createsThumbnail: postThumbnail,
  withCategories,
  ssr: ssrPosts
})

/**
 * The exports object.
 */
const module: Feeddy = {
  posts: posts,
  entries: entries,
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
assign2(exports, module);

export {
  feed,
  buildUrl,
  getId
}
