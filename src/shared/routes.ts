import {FeedRoute, FeedType} from "@feeddy/types/feeds/options";
import {concat} from "@jstls/core/shortcuts/indexable";
import {Maybe} from "@jstls/types/core";
import {Routes} from "@feeddy/types/feeds/shared";
import {forEach} from "@jstls/core/shortcuts/array";
import {readonly2} from "@jstls/core/definer";
import {indefinite} from "@jstls/core/utils/types";

export function createRoute(type: Maybe<FeedType>, route: Maybe<FeedRoute>, id?: string): string {
  let suffix = route === "full" ? "full" : "summary",
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
