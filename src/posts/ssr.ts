import {PostsSsrHandler, PostsSsrOptions} from "@/types/posts";
import {get, set} from "@jstls/core/objects/handlers/getset";
import {firstOrNull, isEmpty, isNotEmpty} from "@jstls/core/extensions/shared/iterables";
import {entriesBase} from "@/entries/base";
import {basicHandler} from "@/entries/handler";
import {BasePostEntry} from "@/types/feeds/posts";
import {indefinite} from "@jstls/core/utils/types";
import {queryBuilder} from "@/search/query";
import {concat} from "@jstls/core/shortcuts/indexable";
import {KeyableObject} from "@jstls/types/core/objects";
import {resolve} from "@jstls/core/polyfills/promise/fn";
import {apply} from "@jstls/core/functions/apply";
import {includes} from "@jstls/core/polyfills/indexable/es2016";
import {keys} from "@jstls/core/shortcuts/object";

function createUrl(base: string, parameters: Record<string, string>): string {
  const values = keys(parameters);

  return isEmpty(values) ? base : concat(
    base, "?",
    values
      .sort((a, b) => a.localeCompare(b))
      .map(key => concat(key, '=', parameters[key]))
      .join("&")
  );
}

export function ssrPosts(options: PostsSsrOptions): Promise<PostsSsrHandler> {
  set(options, "feed", "type", "posts");

  const ssr = get(options, "ssr"),
    label = get(options, "category")!,
    sourceParams = get(options, "feed", "params");

  let query = get(sourceParams, "q"),
    url = "/search";

  if (ssr === "label" && label && isNotEmpty(label)) {
    url = concat(url, "/label/", label);
    query = queryBuilder()
      .labels(label)
      .build();
  } else if (ssr !== "query")
    query = indefinite!;

  set(sourceParams, "q", query);
  return entriesBase(options, basicHandler((feed, params, builder, request) => {
    const max = params.max(),
      query = params.query();

    return (page: number) => {
      let baseUrl = url,
        parameters: KeyableObject = {
          "max-results": max,
        },
        early = indefinite! as boolean;


      builder
        .max(max)
        .paginated(page)
        .minusIndex(1)


      if (ssr === "query" && query) {
        parameters['q'] = query;
        parameters['by-date'] = true;
      }

      if (page === 1) {
        if ((ssr !== "query" || !query) && (ssr !== "label" || !label)) {
          baseUrl = "/";
          parameters = {};
        }
        early = true;
      } else if (apply(includes, ["query", "default2"], [ssr])) {
        parameters["start"] = params.start();
        parameters["by-date"] = true;
        if (ssr === "default2") {
          parameters["q"] = "*";
        }
        parameters["by-date"] = true;
        early = true;
      }

      if (early)
        return resolve({
          parameters,
          url: createUrl(baseUrl, parameters)
        })

      feed.params = builder
        .max(1)
        .build()

      return request(feed)
        .then(result => {
          const entry = firstOrNull(get(result, "feed", "entry") || []) as BasePostEntry;
          if (!entry)
            return {
              parameters: {},
              url: '/'
            };

          let date = entry.published;
          date = date.substring(0, 19) + date.substring(23, 29)

          parameters["updated-max"] = date;

          return {
            parameters,
            url: createUrl(baseUrl, parameters),
          }
        });
    }
  }),)
}


