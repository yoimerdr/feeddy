import {maxResults, paramsFrom} from "@/search";
import {requireDefined, requireObject} from "@jstls/core/objects/validators";
import {isDefined, isObject} from "@jstls/core/objects/types";
import {IllegalArgumentError} from "@jstls/core/exceptions";
import {apply} from "@jstls/core/functions/apply";
import {coerceIn} from "@jstls/core/extensions/number";
import {keys} from "@jstls/core/shortcuts/object";
import {forEach} from "@jstls/core/shortcuts/array";
import {BaseFeedOptions} from "@/types/feeds/options";
import {createRoute} from "./routes";
import {RawText} from "@/types/feeds/raw/entry";
import {hasOwn} from "@jstls/core/polyfills/objects/es2022";
import {get} from "@jstls/core/objects/handlers/getset";
import {includes} from "@jstls/core/polyfills/indexable/es2016";
import {concat} from "@jstls/core/shortcuts/indexable";


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
  else if (typeof location !== "undefined")
    href = location.origin;
  else throw new IllegalArgumentError("You must pass the blog url or call this on the browser.");

  options.blogUrl = href;
  const fetchUrl = new URL(href);

  fetchUrl.pathname += createRoute(options.type, options.route, id);

  const params = paramsFrom(options.params);
  params.max(coerceIn(1, maxResults, params.max(),));
  params.alt(params.alt());

  const search = params.source;
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
    hasOwn(source, "$t") && (source = get(source, "$t"));
  }
  if (!apply(includes, ["blog", "post", "page"], [type]))
    throw new IllegalArgumentError(concat("'", type, "' is an unknown type id."));

  const expr = new RegExp(concat(type, "-([0-9]+)"), "g"),
    res = requireDefined(expr.exec(source as string))
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
