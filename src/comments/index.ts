import {ByIdCommentsOptions, ByIdCommentsOptionsSummary, CommentsHandler} from "@/types/comments";
import {entries2} from "@/entries";
import {FeedRoute} from "@/types/feeds/options";
import {get, set} from "@jstls/core/objects/handlers/getset";
import {nullable} from "@jstls/core/utils/types";

export function commentsById<R extends FeedRoute = FeedRoute, >(options: ByIdCommentsOptions<R>): Promise<CommentsHandler<R>>;
export function commentsById(options: ByIdCommentsOptionsSummary): Promise<CommentsHandler<"summary">>;
export function commentsById(options: ByIdCommentsOptions | ByIdCommentsOptionsSummary): Promise<CommentsHandler> {
  set(options, "feed", "type", "comments")
  return entries2(options, nullable!, get(options, "id"));
}
