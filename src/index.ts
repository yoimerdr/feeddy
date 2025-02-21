import {Posts} from "./types/posts";
import {Search} from "./types/search";
import {Routes} from "./types/feeds/shared";
import {Entries} from "./types/entries";
import {Pages} from "./types/pages";
import {Comments} from "./types/comments";

export * from "./module";
/**
 * The handler to paginate the blogger feed posts.
 */
export declare const posts: Posts;
/**
 * The helper to build the query and search parameters for a request to the blog's feed.
 */
export declare const search: Search;
/**
 * The helper to know some of the sub routes of the blog feed. All are relatives.
 */
export declare const routes: Routes;

export declare const entries: Entries;

export declare const pages: Pages;

export declare const comments: Comments;
