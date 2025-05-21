import {rawAll, rawById, rawGet} from "@/feeds/raw";
import {all, byId, get} from "@/feeds";
import {paramsBuilder, SearchParams, SearchParamsBuilder} from "@/search";
import {buildUrl, getId} from "@/shared";
import {Routes} from "@/types/feeds/shared";
import {posts,} from "@/posts";
import {readonlys2} from "@jstls/core/definer";
import {Feed} from "./types/feeds";
import {Posts} from "./types/posts";
import {queryBuilder, QueryStringBuilder} from "./search/query";
import {Search} from "./types/search";
import {postThumbnail} from "./posts/converters";
import {withCategories} from "./posts/related";
import {entries} from "./entries";
import {Entries, EntriesOptions} from "./types/entries";
import {routes} from "./shared/routes";
import {KeyableObject} from "@jstls/types/core/objects";
import {set} from "@jstls/core/objects/handlers/getset";
import {FeedByIdOptions} from "./types/feeds/options";
import {forEach} from "@jstls/core/shortcuts/array";
import {assign2} from "@jstls/core/objects/factory";
import {Comments} from "./types/comments";
import {Pages} from "./types/pages";
import {commentsById} from "./comments";
import {RawFeed} from "./types/feeds/raw";
import {entryPathname} from "./entries/shared";

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
readonlys2(rawGet as RawFeed, {
  all: rawAll,
  byId: rawById,
})

/**
 * The handler to make mapped requests to the blogger feed API.
 */
const feed: Feed = get as any;

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
readonlys2(entries as Entries, {
  byId,
  createsPathname: entryPathname,
})

/**
 * Define the sub handlers for posts.
 */
readonlys2(posts as Posts, {
  createsThumbnail: postThumbnail,
  withCategories
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
