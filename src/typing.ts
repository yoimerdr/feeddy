import {buildUrl, getId} from "./shared";
import {Routes} from "./types/feeds/shared";
import {Feed} from "./types/feeds";
import {Search} from "./types/search";
import {Posts} from "./types/posts";
import {Entries} from "./types/entries";
import {Comments} from "./types/comments";
import {Pages} from "./types/pages";

interface Feeddy {
  /**
   * @func
   */
  buildUrl: typeof buildUrl;
  /**
   * @func
   * @since 1.2
   */
  getId: typeof getId;
  /**
   * Helper containing relative sub-routes for the blog feed API.
   * Provides path constants for different feed endpoints.
   */
  routes: Routes;
  /**
   * The handler to make mapped requests to the blogger feed API.
   * @func
   */
  feed: Feed;
  /**
   * Utility for building search queries and parameters for blog feed requests.
   * Includes builders for constructing query strings and search parameter objects.
   */
  search: Search;
  /**
   * Handler for paginated access to blog posts.
   * @func
   */
  posts: Posts;
  /**
   * Generic handler for paginated access to blog entries.
   * Supports posts, comments and pages with configurable route types.
   * @since 1.2
   * @func
   */
  entries: Entries;
  /**
   * Handler for paginated access to blog comments.
   * @since 1.2
   * @func
   */
  comments: Comments,
  /**
   * Handler for paginated access to blog pages.
   * @since 1.2
   * @func
   */
  pages: Pages
}

declare const feeddy: Feeddy;

export default feeddy;
