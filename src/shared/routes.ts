import {FeedRoute, FeedType} from "../types/feeds/options";
import {concat} from "../../lib/jstls/src/core/shortcuts/string";
import {Maybe} from "../../lib/jstls/src/types/core";
import {Routes} from "../types/feeds/shared";
import {forEach} from "../../lib/jstls/src/core/shortcuts/array";
import {readonly2} from "../../lib/jstls/src/core/definer";
import {indefinite} from "../../lib/jstls/src/core/utils/types";

export function createRoute(type: Maybe<FeedType>, route: Maybe<FeedRoute>, id?: string): string {
  let suffix = route === "full" ? "default" : "summary",
    mid = "posts",
    prefix = "/";

  if (type === "pages")
    mid = "pages";
  else if (type === "comments") {
    mid = "comments";
    id && (prefix = concat(prefix, id, prefix))
  }
  id && type !== "comments" && (suffix += concat("/", id));

  return concat("feeds", prefix, mid, "/", suffix);
}

/**
 * The blogger feed routes.
 */
export const routes: Routes = {} as Routes;

forEach(<any>["posts", "pages", "comments"], (key: FeedType) => {
  readonly2(routes, key, createRoute(key, "full"));
  readonly2(routes, key + "Summary", createRoute(key, indefinite!));
});
