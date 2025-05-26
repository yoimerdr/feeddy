import {ByIdCommentsOptions, ByIdCommentsOptionsSummary, CommentsHandler} from "@feeddy/types/comments";
import {FeedRoute} from "@feeddy/types/feeds/options";
import {get, set} from "@jstls/core/objects/handlers/getset";
import {entriesBase} from "@feeddy/entries/base";
import {basicHandler, basicHandlerPage} from "@feeddy/entries/handler";

export function commentsById<R extends FeedRoute = FeedRoute, >(options: ByIdCommentsOptions<R>): Promise<CommentsHandler<R>>;
export function commentsById(options: ByIdCommentsOptionsSummary): Promise<CommentsHandler<"summary">>;
export function commentsById(options: ByIdCommentsOptions | ByIdCommentsOptionsSummary): Promise<CommentsHandler> {
  set(options, "feed", "type", "comments")
  return entriesBase(options, basicHandler(basicHandlerPage), get(options, "id"));
}
