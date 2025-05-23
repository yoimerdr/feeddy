import {PostsHandler, PostsOptions, PostsOptionsSummary} from "@/types/posts";
import {set} from "@jstls/core/objects/handlers/getset";
import {freeze} from "@jstls/core/shortcuts/object";
import {PostsBlog} from "@/types/feeds/posts";
import {FeedRoute} from "@/types/feeds/options";
import {entriesBase} from "@/entries/base";
import {basicHandler, basicHandlerPage} from "@/entries/handler";


export function posts<R extends FeedRoute = FeedRoute>(options: PostsOptions<R>): Promise<PostsHandler<R>>;
export function posts(options: PostsOptionsSummary): Promise<PostsHandler<"summary">>;
export function posts(options: PostsOptions | PostsOptionsSummary): Promise<PostsHandler> {
  set(options, "feed", "type", "posts");
  return entriesBase(options, basicHandler(basicHandlerPage, (blog: PostsBlog) => (<PostsHandler>{
    categories: freeze(blog.feed.category || []),
  })));
}
