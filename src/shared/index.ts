import {FeedOptions, Routes} from "../types/feeds/shared";
import {SearchParams, SearchParamsBuilder} from "../search";
import {requireDefined} from "../../lib/jstls/src/core/objects/validators";
import {isDefined} from "../../lib/jstls/src/core/objects/types";
import {IllegalArgumentError} from "../../lib/jstls/src/core/exceptions";
import {entries} from "../../lib/jstls/src/core/objects/factory";
import {each} from "../../lib/jstls/src/core/iterable/each";
import {apply} from "../../lib/jstls/src/core/functions/apply";
import {coerceIn} from "../../lib/jstls/src/core/extensions/number";

/**
 * The blogger feed routes.
 */
export const routes: Routes = {

  /**
   * The default feed posts route.
   */
  posts(): string {
    return "feeds/posts/default";
  },

  /**
   * The summary feed posts route.
   */
  postsSummary(): string {
    return "feeds/posts/summary";
  }
}

/**
 * Builds a request url according the given options.
 * @param options The request options.
 */
export function buildUrl(options: Partial<FeedOptions>): URL {
  requireDefined(options, "options")
  let href: string;
  if (isDefined(options.blogUrl))
    href = options.blogUrl!;
  else if (location)
    href = location.origin;
  else throw new IllegalArgumentError(`You must pass the blog url or call this on the browser.`);

  options.blogUrl = href;
  const fetchUrl = new URL(href);

  fetchUrl.pathname += options.route === 'full' ? routes.posts() : routes.postsSummary();

  const params = SearchParams.from(options.params);
  params.alt("json");
  params.max(apply(coerceIn, params.max(), [1, SearchParamsBuilder.maxResults]));
  each(entries(params.toDefined()), param => {
    fetchUrl.searchParams.set(<string>param.key, <string>param.value)
  });
  return fetchUrl;
}
