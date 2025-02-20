import {
  ByIdPostsOptions,
  ByIdPostsOptionsSummary,
  PostsHandler,
  PostsOptions,
  PostsOptionsSummary
} from "../types/posts";
import {entries2} from "../entries";
import {set} from "../../lib/jstls/src/core/objects/handlers/getset";
import {freeze} from "../../lib/jstls/src/core/shortcuts/object";
import {PostsBlog} from "../types/feeds/posts";
import {FeedRoute} from "../types/feeds/options";
import {ByIdResult} from "../types/feeds";
import {KeyableObject} from "../../lib/jstls/src/types/core/objects";
import {requireObject} from "../../lib/jstls/src/core/objects/validators";
import {byId} from "../feeds";

export const thumbnailSizeExpression: string = 's72-c';

export function posts<R extends FeedRoute = FeedRoute>(options: PostsOptions<R>): Promise<PostsHandler<R>>;
export function posts(options: PostsOptionsSummary): Promise<PostsHandler<"summary">>;
export function posts(options: PostsOptions | PostsOptionsSummary): Promise<PostsHandler> {
  requireObject(options, "options")
  set(options.feed, "type", "posts");
  return entries2<PostsBlog, PostsHandler>(options, (blog) => ({
    categories: freeze(blog.feed.category || []),
  }));
}

export function postById<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<ByIdResult<"posts", R>>;
export function postById(options: ByIdPostsOptionsSummary): Promise<ByIdResult<"posts", "summary">>;
export function postById(options: ByIdPostsOptions | ByIdPostsOptionsSummary): Promise<KeyableObject> {
  requireObject(options, "options")
  set(options.feed, "type", "posts");
  return byId(options)
}
