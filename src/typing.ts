import {buildUrl, getId} from "./shared";
import {Routes} from "./types/feeds/shared";
import {FeedNamespace} from "./types/feeds";
import {SearchNamespace} from "./types/search";
import {PostsNamespace} from "./types/posts";
import {EntriesNamespace} from "./types/entries";
import {CommentsNamespace} from "./types/comments";
import {PagesNamespace} from "./types/pages";
import {ConvertersNamespace} from "@feeddy/types/converters";

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
  feed: FeedNamespace;
  /**
   * Utility for building search queries and parameters for blog feed requests.
   * Includes builders for constructing query strings and search parameter objects.
   */
  search: SearchNamespace;
  /**
   * Handler for paginated access to blog posts.
   * @func
   */
  posts: PostsNamespace;
  /**
   * Generic handler for paginated access to blog entries.
   * Supports posts, comments and pages with configurable route types.
   * @since 1.2
   * @func
   */
  entries: EntriesNamespace;
  /**
   * Handler for paginated access to blog comments.
   * @since 1.2
   * @func
   */
  comments: CommentsNamespace,
  /**
   * Handler for paginated access to blog pages.
   * @since 1.2
   * @func
   */
  pages: PagesNamespace,
  /**
   * Handler for converters values from raw responses.
   * @since 1.4.0
   * */
  converters: ConvertersNamespace,
}

declare const feeddy: Feeddy;

export default feeddy;
