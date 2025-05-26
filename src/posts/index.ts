import {PostsHandler, PostsOptions, PostsOptionsSummary} from "@feeddy/types/posts";
import {set} from "@jstls/core/objects/handlers/getset";
import {freeze} from "@jstls/core/shortcuts/object";
import {PostsBlog} from "@feeddy/types/feeds/posts";
import {FeedRoute} from "@feeddy/types/feeds/options";
import {entriesBase} from "@feeddy/entries/base";
import {basicHandler, basicHandlerPage} from "@feeddy/entries/handler";


export function posts<R extends FeedRoute = FeedRoute>(options: PostsOptions<R>): Promise<PostsHandler<R>>;
export function posts(options: PostsOptionsSummary): Promise<PostsHandler<"summary">>;
export function posts(options: PostsOptions | PostsOptionsSummary): Promise<PostsHandler> {
  set(options, "feed", "type", "posts");
  return entriesBase(options, basicHandler(basicHandlerPage, (blog: PostsBlog) => (<PostsHandler>{
    categories: freeze(blog.feed.category || []),
  })));
}
