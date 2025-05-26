import {PostsNamespace} from "./types/posts";
import {SearchNamespace} from "./types/search";
import {Routes} from "./types/feeds/shared";
import {EntriesNamespace} from "./types/entries";
import {PagesNamespace} from "./types/pages";
import {CommentsNamespace} from "./types/comments";

export * from "./module";

/**
 * Handler for paginated access to blog posts.
 */
export declare const posts: PostsNamespace;

/**
 * Utility for building search queries and parameters for blog feed requests.
 * Includes builders for constructing query strings and search parameter objects.
 */
export declare const search: SearchNamespace;

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
export declare const entries: EntriesNamespace;

/**
 * Handler for paginated access to blog pages.
 * @since 1.2
 */
export declare const pages: PagesNamespace;

/**
 * Handler for paginated access to blog comments.
 * @since 1.2
 */
export declare const comments: CommentsNamespace;
