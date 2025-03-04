import {Posts} from "./types/posts";
import {Search} from "./types/search";
import {Routes} from "./types/feeds/shared";
import {Entries} from "./types/entries";
import {Pages} from "./types/pages";
import {Comments} from "./types/comments";

export * from "./module";

/**
 * Handler for paginated access to blog posts.
 */
export declare const posts: Posts;

/**
 * Utility for building search queries and parameters for blog feed requests.
 * Includes builders for constructing query strings and search parameter objects.
 */
export declare const search: Search;

/**
 * Helper containing relative sub-routes for the blog feed API.
 * Provides path constants for different feed endpoints.
 */
export declare const routes: Routes;

/**
 * Generic handler for paginated access to blog entries.
 * Supports posts, comments and pages with configurable route types.
 * @since 1.2
 */
export declare const entries: Entries;

/**
 * Handler for paginated access to blog pages.
 * @since 1.2
 */
export declare const pages: Pages;

/**
 * Handler for paginated access to blog comments.
 * @since 1.2
 */
export declare const comments: Comments;
