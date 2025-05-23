import {ByIdCommentsOptions, ByIdCommentsOptionsSummary, CommentsHandler} from "@/types/comments";
import {FeedRoute} from "@/types/feeds/options";
import {get, set} from "@jstls/core/objects/handlers/getset";
import {entriesBase} from "@/entries/base";
import {basicHandler, basicHandlerPage} from "@/entries/handler";

export function commentsById<R extends FeedRoute = FeedRoute, >(options: ByIdCommentsOptions<R>): Promise<CommentsHandler<R>>;
export function commentsById(options: ByIdCommentsOptionsSummary): Promise<CommentsHandler<"summary">>;
export function commentsById(options: ByIdCommentsOptions | ByIdCommentsOptionsSummary): Promise<CommentsHandler> {
  set(options, "feed", "type", "comments")
  return entriesBase(options, basicHandler(basicHandlerPage), get(options, "id"));
}
