import {paramsFrom, SearchParams} from "./params";
import {Keys, Maybe, MaybeString} from "@jstls/types/core";
import {isDefined} from "@jstls/core/objects/types";
import {uid} from "@jstls/core/polyfills/symbol";
import {apply} from "@jstls/core/functions/apply";
import {toInt} from "@jstls/core/extensions/string";
import {coerceAtLeast} from "@jstls/core/extensions/number";
import {string} from "@jstls/core/objects/handlers";
import {get, set} from "@jstls/core/objects/handlers/getset";
import {readonly2, writeable} from "@jstls/core/definer";
import {Alt, OrderBy, RequestFeedParams} from "@/types/feeds/shared/params";
import {ThisObjectKeys} from "@jstls/types/core/objects";
import {dateTypes, parametersMap} from "../shared";
import {forEach} from "@jstls/core/shortcuts/array";
import {indefinite, nullable} from "@jstls/core/utils/types";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {deletesAll} from "@jstls/core/objects/handlers/deletes";

export interface SearchParamsBuilder {
  /**
   * Changes the maximum number of results to be retrieved.
   * @param max The max value. The minimum value is 1.
   */
  max(max: Maybe<number | string>): this;

  /**
   * Changes the maximum number of results to be retrieved.
   *
   * <b>Alias</b>.
   * @example
   * builder.limit(limit) // .max(limit)
   * @param limit The max value. The minimum value is 1.
   * @see {max}
   */
  limit(limit: Maybe<number | string>): this;

  /**
   * Changes the 1-based index of the first result to be retrieved.
   *
   * <b>Blogger API Note</b>
   * - This isn't a general cursoring mechanism.
   * If you first send a query with ?start-index=1&max-results=10 and then send another query with ?start-index=11&max-results=10,
   * the service cannot guarantee that the results are equivalent to ?start-index=1&max-results=20,
   * because insertions and deletions could have taken place in between the two queries.
   *
   * @param index The index value.
   */
  start(index: Maybe<number | string>): this;

  /**
   * Adds the given index to the current start index.
   * @param index The value to add.
   */
  plusStart(index: number): this;

  /**
   * Subtracts the given index from the current start index.
   * @param index The value to subtract.
   */
  minusStart(index: number): this;

  /**
   * Changes the 1-based index of the first result to be retrieved.
   *
   * <b>Alias</b>.
   * @example
   * builder.index(index) //.start(index)
   *
   * @param index The index value.
   * @see {start}
   */
  index(index: Maybe<number | string>): this;

  /**
   * Adds the given index to the current start index.
   * @param index The value to add.
   */
  plusIndex(index: number): this;

  /**
   * Subtracts the given index from the current start index.
   * @param index The value to subtract.
   */
  minusIndex(index: number): this;

  /**
   * Changes the 1-based index of the first result to be retrieved
   * according to the {@link max} value.
   *
   * @example
   * builder.max(10)
   *  .paginated(2) // .start(11)
   *
   * @param page The page value. The minimum is 0.
   * @see {max}
   */
  paginated(page: Maybe<number | string>): this;

  /**
   * Changes the bounds on the entry publication date.
   *
   * - The lower bound is inclusive, whereas the upper bound is exclusive.
   * - Use the RFC 3339 timestamp format. For example: 2005-08-09T10:57:00-08:00.
   *
   * @param min The min publication date value.
   * @param max The max publication date value.
   */
  published(min: MaybeString, max?: MaybeString): this;

  /**
   * Changes the inclusive min bound on the entry publication date.
   *
   * @param min The min publication date value.
   * @see {published}
   */
  publishedAtLeast(min: MaybeString): this;

  /**
   * Changes the exclusive max bound on the entry publication date.
   *
   * @param max The max publication date value.
   * @see {published}
   */
  publishedAtMost(max: MaybeString): this;

  /**
   * Changes the bounds on the entry update date.
   *
   * - The lower bound is inclusive, whereas the upper bound is exclusive.
   * - Use the RFC 3339 timestamp format. For example: 2005-08-09T10:57:00-08:00.
   *
   * @param min The min updated date value.
   * @param max The max updated date value.
   */
  updated(min: MaybeString, max?: MaybeString): this;

  /**
   * Changes the inclusive min bound on the entry update date.
   *
   * @param min The min updated date value.
   * @see {updated}
   */
  updatedAtLeast(min: MaybeString): this;

  /**
   * Changes the exclusive min bound on the entry update date.
   *
   * @param max The max updated date value.
   * @see {updated}
   */
  updatedAtMost(max: MaybeString): this;

  /**
   * Changes the sort order applied to results.
   * @param order The sort order.
   */
  order(order: Maybe<OrderBy>): this;

  /**
   * Changes the full-text query string.
   *
   * <b>Blogger API Notes</b>
   * - When creating a query, list search terms separated by spaces, in the form q=term1 term2 term3.
   * - The Google Data service returns all entries that match all of the search terms (like using AND between terms).
   * - Like Google's web search, a Google Data service searches on complete words (and related words with the same stem), not substrings.
   * - To search for an exact phrase, enclose the phrase in quotation marks: q="exact phrase".
   * - To exclude entries that match a given term, use the form q=-term.
   * - The search is case-insensitive.
   * - Example: to search for all entries that contain the exact phrase "Elizabeth Bennet"
   * and the word "Darcy" but don't contain the word "Austen", use the following query: ?q="Elizabeth Bennet" Darcy -Austen.
   *
   * @param query The query value.
   *
   * @see {QueryStringBuilder}
   */
  query(query: MaybeString): this;

  /**
   * Changes alternative representation type.
   * @param alt The alternative representation type.
   * @since 1.2
   */
  alt(alt: Maybe<Alt>): this;

  /**
   * Clears all the parameters.
   *
   * @since 1.2.1
   */
  clear(): this;

  /**
   * Creates the search feed params.
   * @param copy If true, return a copy of the created params.
   */
  build(copy?: boolean): Partial<RequestFeedParams>;
}

export interface SearchParamsBuilderConstructor {
  /**
   * Instances a new search params builder.
   * @param source The source params.
   */
  new(source: Partial<RequestFeedParams> | SearchParams): SearchParamsBuilder;

  /**
   * Creates a new builder from the given params
   * @param params The source params.
   * @param copy If true, creates first a new param object from the given.
   * @static
   */
  from(params?: Partial<RequestFeedParams> | SearchParams, copy?: boolean): SearchParamsBuilder

  /**
   * Creates a new builder.
   * @static
   */
  empty(): SearchParamsBuilder

  /**
   * The maximum value of results that the blogger feed api can retrieve.
   *
   * This number is representative, the actual value may be much lower.
   * @static
   */
  readonly maxResults: number;
}

function paramIndex($this: SearchParamsBuilder, index: Maybe<number | string>, action: 'place' | 'plus' | 'minus') {
  const params = get($this, searchParamsSymbol) as SearchParams;
  let current = params.start();
  index = toInt(indefinite, string(index))! >> 0;

  current = action === 'plus' ? current + index : (action === 'minus' ? current - index : index);
  params.start(current);
  return $this;
}

function paramDate($this: SearchParamsBuilder,
                   min: MaybeString, max: MaybeString, type: "published" | "updated",
                   keepAtLeast?: boolean, keepAtMost?: boolean) {
  const params = get($this, searchParamsSymbol) as SearchParams;
  (isDefined(min) || !keepAtLeast) && apply(get(params, type + "AtLeast"), params, [min]);
  (isDefined(max) || !keepAtMost) && apply(get(params, type + "AtMost"), params, [max]);

  return $this;
}

const searchParamsSymbol = uid("p");
export const maxResults: number = 500;


function simpleProperty(key: Keys<SearchParams>) {
  return function (this: SearchParamsBuilder, value: any): SearchParamsBuilder {
    const $this = this,
      params = get($this, searchParamsSymbol);
    apply(get(params, key), params, [value]);
    return $this;
  }
}

const source = ['place', 'plus', 'minus']
  .map((mode: any) => {
    return function (this: SearchParamsBuilder, index: Maybe<number | string>): SearchParamsBuilder {
      return paramIndex(this, index, mode)
    }
  });

const max = simpleProperty("max"),
  prototype: Partial<ThisObjectKeys<SearchParamsBuilder>> = {
    max,
    limit: max,
    start: source[0],
    plusStart: source[1],
    minusStart: source[2],
    index: source[0],
    plusIndex: source[1],
    minusIndex: source[2],
    paginated(page: Maybe<number | string>) {
      const $this = this;
      if (isDefined(page)) {
        const max = get($this, searchParamsSymbol).max();
        $this.start(coerceAtLeast(0, toInt(nullable, string(page))! - 1) * max + 1);
      }
      return $this;
    },
    order: simpleProperty("orderby"),
    query: simpleProperty("query"),
    alt: simpleProperty("alt"),
    clear() {
      const $this = this;
      deletesAll(get($this, searchParamsSymbol).source);
      return $this;
    },
    build(copy?: boolean): Partial<RequestFeedParams> {
      const params = get(this, searchParamsSymbol) as SearchParams,
        source = params.source;
      return copy ? builderFrom(source, true)
        .build() : source;
    }
  };

forEach(dateTypes, (type: "published" | "updated") => {
  set(prototype, type, function (this: SearchParamsBuilder, min: MaybeString, max?: MaybeString): SearchParamsBuilder {
    return paramDate(this, min, max, type);
  });
  set(prototype, type + "AtLeast", function (this: SearchParamsBuilder, min: MaybeString): SearchParamsBuilder {
    return paramDate(this, min, indefinite, type, false, true);
  });
  set(prototype, type + "AtMost", function (this: SearchParamsBuilder, max: MaybeString): SearchParamsBuilder {
    return paramDate(this, indefinite, max, type, true)
  })
});

export const SearchParamsBuilder: SearchParamsBuilderConstructor = funclass2({
  construct: function (source) {
    if (source instanceof SearchParams) {
      writeable(this, searchParamsSymbol, source);
      source = source.source;
      for (const key in source) {
        const map = parametersMap[key as keyof RequestFeedParams] as keyof SearchParamsBuilder;
        map && this[map](source[key as keyof RequestFeedParams] as never);
      }
    } else return builderFrom(source)
  },
  statics: {
    from: builderFrom,
    empty: paramsBuilder
  },
  prototype
})

readonly2(SearchParamsBuilder, "maxResults", maxResults);

/**
 * Creates a new builder from the given params
 * @param params The source params.
 * @param copy If true, creates first a new param object from the given.
 */
export function builderFrom(params?: Partial<RequestFeedParams> | SearchParams, copy?: boolean): SearchParamsBuilder {
  return new SearchParamsBuilder(paramsFrom(params, copy))
}

/**
 * Creates a new params builder.
 */
export function paramsBuilder(): SearchParamsBuilder {
  return new SearchParamsBuilder({});
}
