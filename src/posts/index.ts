import {PostsHandler, PostsOptions, PostsOptionsSummary} from "../types/posts";
import {entries2} from "../entries";
import {set} from "../../lib/jstls/src/core/objects/handlers/getset";
import {freeze} from "../../lib/jstls/src/core/shortcuts/object";
import {PostsBlog} from "../types/feeds/posts";
import {FeedRoute} from "../types/feeds/options";

export const thumbnailSizeExpression: string = 's72-c';

export function posts<R extends FeedRoute = FeedRoute>(options: PostsOptions<R>): Promise<PostsHandler<R>>;
export function posts(options: PostsOptionsSummary): Promise<PostsHandler<"summary">>;
export function posts(options: PostsOptions | PostsOptionsSummary): Promise<PostsHandler> {
  set(options, "feed", "type", "posts");
  return entries2<PostsBlog, PostsHandler>(options, (blog) => ({
    categories: freeze(blog.feed.category || []),
  }));
}
