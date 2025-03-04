import {maxResults, paramsFrom} from "../search";
import {requireDefined, requireObject} from "../../lib/jstls/src/core/objects/validators";
import {isDefined, isObject} from "../../lib/jstls/src/core/objects/types";
import {IllegalArgumentError} from "../../lib/jstls/src/core/exceptions";
import {apply} from "../../lib/jstls/src/core/functions/apply";
import {coerceIn} from "../../lib/jstls/src/core/extensions/number";
import {keys} from "../../lib/jstls/src/core/objects/handlers/properties";
import {forEach} from "../../lib/jstls/src/core/shortcuts/array";
import {BaseFeedOptions} from "../types/feeds/options";
import {createRoute} from "./routes";
import {RawText} from "../types/feeds/raw/entry";
import {hasOwn} from "../../lib/jstls/src/core/polyfills/objects/es2022";
import {get} from "../../lib/jstls/src/core/objects/handlers/getset";
import {includes} from "../../lib/jstls/src/core/polyfills/indexable/es2016";
import {concat} from "../../lib/jstls/src/core/shortcuts/string";


/**
 * Builds a request URL for the blog feed API based on provided options.
 *
 * @param options - Configuration options for the request
 * @param id - Optional ID of a specific entry to fetch.
 * @returns Constructed URL object with appropriate path and query parameters
 * @throws {IllegalArgumentError} If options object is invalid or blog URL cannot be determined
 * @remarks The id parameter is supported since 1.2
 */
export function buildUrl(options: Partial<BaseFeedOptions>, id?: string): URL {
  requireObject(options, "options")

  let href: string;
  if (isDefined(options.blogUrl))
    href = options.blogUrl!;
  else if (location)
    href = location.origin;
  else throw new IllegalArgumentError("You must pass the blog url or call this on the browser.");

  options.blogUrl = href;
  const fetchUrl = new URL(href);

  fetchUrl.pathname += createRoute(options.type, options.route, id);

  const params = paramsFrom(options.params);
  params.max(apply(coerceIn, params.max(), [1, maxResults]));
  params.alt(params.alt());

  const search = params.toDefined()
  forEach(keys(search), key => {
    fetchUrl.searchParams.set(key, search[key] as string);
  })

  return fetchUrl;
}

/**
 * Extracts the numeric ID from a blog entry identifier string or object.
 *
 * @param source - The source containing the ID.
 * @param type - The type of entry ID to extract (blog, post, page).
 * @returns The extracted numeric ID as a string
 * @throws {IllegalArgumentError} If type is invalid or ID cannot be extracted
 * @since 1.2
 */
export function getId(source: string | RawText | Record<"id", RawText | string>, type: "blog" | "post" | "page"): string {
  if (isObject(source)) {
    if (hasOwn(source, "id"))
      return getId(get(source, "id"), type);
    if (hasOwn(source, "$t"))
      source = get(source, "$t");
  }
  if (!apply(includes, ["blog", "post", "page"], [type]))
    throw new IllegalArgumentError(concat("'", type, "' is an unknown type id."));

  const expr = new RegExp(concat(type, "-", "([0-9]+)"), "g");
  const res = requireDefined(expr.exec(source as string))
  return res[1];
}

/**
 * Checks if the given feed options are for a comments feed.
 *
 * @param options - The feed options to check
 * @returns True if the feed type is 'comments', false otherwise
 * @since 1.2
 */
export function isComments(options: Partial<BaseFeedOptions>): boolean {
  return get(options, "type") === "comments";
}
