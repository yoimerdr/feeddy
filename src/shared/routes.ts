import {FeedRoute, FeedType} from "../types/feeds/options";
import {concat} from "../../lib/jstls/src/core/shortcuts/string";
import {Maybe} from "../../lib/jstls/src/types/core";
import {Routes} from "../types/feeds/shared";
import {forEach} from "../../lib/jstls/src/core/shortcuts/array";
import {readonly2} from "../../lib/jstls/src/core/definer";

export function createRoute(type: Maybe<FeedType>, route: Maybe<FeedRoute>) {
  let suffix = "summary"
  let mid = "posts";

  if (route === "full")
    suffix = "default"

  if (type === "pages")
    mid = "pages";
  else if (type === "comments")
    mid = "comments";

  return concat("feeds", "/", mid, "/", suffix);
}

/**
 * The blogger feed routes.
 */
export const routes: Routes = {} as Routes;

forEach(<any>["posts", "pages", "comments"], (key: FeedType) => {
  readonly2(routes, key, createRoute(key, "full"));
  readonly2(routes, key + "Summary", createRoute(key, "summary"));
});
