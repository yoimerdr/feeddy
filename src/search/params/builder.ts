import {SearchParams} from "./params";
import {OrderBy, RequestFeedParams} from "../../types/feeds/shared";
import {Maybe, MaybeString} from "../../../lib/jstls/src/types/core";
import {isDefined} from "../../../lib/jstls/src/core/objects/types";
import {call} from "../../../lib/jstls/src/core/functions/call";
import {uid} from "../../../lib/jstls/src/core/polyfills/symbol";
import {KeyableObject} from "../../../lib/jstls/src/types/core/objects";
import {apply} from "../../../lib/jstls/src/core/functions/apply";
import {toInt} from "../../../lib/jstls/src/core/extensions/string";
import {coerceAtLeast} from "../../../lib/jstls/src/core/extensions/number";
import {string} from "../../../lib/jstls/src/core/objects/handlers";
import {get} from "../../../lib/jstls/src/core/objects/handlers/getset";

function paramIndex(this: SearchParamsBuilder, index: Maybe<number | string>, action: 'replace' | 'add' | 'subtract') {
  const params = get(this, searchParamsSymbol) as SearchParams;
  let current = params.start();
  index = call(toInt, string(index))! >> 0;

  current = action === 'add' ? current + index : (action === 'subtract' ? current - index : index);
  params.start(current);
}

function paramDate(this: SearchParams,
                   min: MaybeString, max: MaybeString,
                   atLeast: (this: SearchParams, min: MaybeString) => MaybeString,
                   atMost: (this: SearchParams, max: MaybeString) => MaybeString,
                   keepAtLeast?: boolean, keepAtMost?: boolean) {
  if (isDefined(min) || !keepAtLeast)
    call(atLeast, this, min);
  if (isDefined(max) || !keepAtMost)
    call(atMost, this, max);
}

const searchParamsSymbol = uid("SearchParamsBuilder#params")

export class SearchParamsBuilder {

  private constructor(source: Partial<RequestFeedParams> | SearchParams) {
    if (source instanceof SearchParams)
      (this as KeyableObject)[searchParamsSymbol] = source;
    else return SearchParamsBuilder.from(source)
  }

  /**
   * Creates a new builder from the given params
   * @param params The source params.
   * @param copy If true, creates first a new param object from the given.
   */
  static from(params?: Partial<RequestFeedParams> | SearchParams, copy?: boolean): SearchParamsBuilder {
    return new SearchParamsBuilder(SearchParams.from(params, copy))
  }

  /**
   * Creates a new builder.
   */
  static empty(): SearchParamsBuilder {
    return new SearchParamsBuilder({});
  }

  /**
   * The maximum value of results that the blogger feed api can retrieve.
   */
  static get maxResults(): number {
    return 500;
  }

  /**
   * Changes the maximum number of results to be retrieved.
   * @param max The max value. The minimum value is 1.
   */
  max(max: Maybe<number | string>): this {
    get(this, searchParamsSymbol).max(max!)
    return this;
  };

  /**
   * Changes the maximum number of results to be retrieved.
   *
   * <b>Alias</b>.
   * @example
   * builder.limit(limit) // .max(limit)
   * @param limit The max value. The minimum value is 1.
   * @see {max}
   */
  limit(limit: Maybe<number | string>): this {
    return this.max(limit)
  }

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
  start(index: Maybe<number | string>): this {
    call(paramIndex, this, index, 'replace')
    return this;
  }

  /**
   * Adds the given index to the current start index.
   * @param index The value to add.
   */
  plusStart(index: number): this {
    call(paramIndex, this, index, 'add')
    return this;
  }

  /**
   * Subtracts the given index from the current start index.
   * @param index The value to subtract.
   */
  minusStart(index: number): this {
    call(paramIndex, this, index, 'subtract')
    return this;
  }

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
  index(index: Maybe<number | string>): this {
    return this.start(index)
  }

  /**
   * Adds the given index to the current start index.
   * @param index The value to add.
   */
  plusIndex(index: number): this {
    return this.plusStart(index);
  }

  /**
   * Subtracts the given index from the current start index.
   * @param index The value to subtract.
   */
  minusIndex(index: number): this {
    return this.minusStart(index);
  }

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
  paginated(page: Maybe<number | string>): this {
    if (isDefined(page)) {
      const max = get(this, searchParamsSymbol).max();
      this.start(apply(coerceAtLeast, call(toInt, string(page))! - 1, [0]) * max + 1);
    }
    return this;
  }

  /**
   * Changes the bounds on the entry publication date.
   *
   * - The lower bound is inclusive, whereas the upper bound is exclusive.
   * - Use the RFC 3339 timestamp format. For example: 2005-08-09T10:57:00-08:00.
   *
   * @param min The min publication date value.
   * @param max The max publication date value.
   */
  published(min: MaybeString, max?: MaybeString): this {
    const params = get(this, searchParamsSymbol) as SearchParams;
    call(paramDate, params, min, max, params.publishedAtLeast, params.publishedAtMost)
    return this;
  }

  /**
   * Changes the inclusive min bound on the entry publication date.
   *
   * <b>Alias</b>.
   * @example
   * builder.publishedAtLeast(min) // .published(min)
   * @param min The min publication date value.
   * @see {published}
   */
  publishedAtLeast(min: MaybeString): this {
    const params = get(this, searchParamsSymbol) as SearchParams;
    call(paramDate, params, min, undefined,
      params.publishedAtLeast, params.publishedAtMost,
      false, true)
    return this;
  }

  /**
   * Changes the exclusive max bound on the entry publication date.
   *
   * <b>Alias</b>.
   * @example
   * builder.publishedAtMost(max) // .published(undefined, max)
   * @param max The max publication date value.
   * @see {published}
   */
  publishedAtMost(max: MaybeString): this {
    const params = get(this, searchParamsSymbol) as SearchParams;
    call(paramDate, params, undefined, max,
      params.publishedAtLeast, params.publishedAtMost, true)
    return this;
  }

  /**
   * Changes the bounds on the entry update date.
   *
   * - The lower bound is inclusive, whereas the upper bound is exclusive.
   * - Use the RFC 3339 timestamp format. For example: 2005-08-09T10:57:00-08:00.
   *
   * @param min The min updated date value.
   * @param max The max updated date value.
   */
  updated(min: MaybeString, max?: MaybeString): this {
    const params = get(this, searchParamsSymbol) as SearchParams;
    call(paramDate, params, min, max, params.updatedAtLeast, params.updatedAtMost)
    return this;
  }

  /**
   * Changes the inclusive min bound on the entry update date.
   *
   * <b>Alias</b>.
   * @example
   * builder.updatedAtLeast(min) // .updated(min)
   * @param min The min updated date value.
   * @see {updated}
   */
  updatedAtLeast(min: MaybeString): this {
    const params = get(this, searchParamsSymbol) as SearchParams;
    call(paramDate, params, min, undefined,
      params.updatedAtLeast, params.updatedAtMost,
      false, true)
    return this;
  }

  /**
   * Changes the exclusive min bound on the entry update date.
   *
   * <b>Alias</b>.
   * @example
   * builder.updatedAtMost(max) // .updated(undefined, max)
   * @param max The max updated date value.
   * @see {updated}
   */
  updatedAtMost(max: MaybeString): this {
    const params = get(this, searchParamsSymbol) as SearchParams;
    call(paramDate, params, undefined, max,
      params.updatedAtLeast, params.updatedAtMost, true)
    return this;
  }


  /**
   * Changes the sort order applied to results.
   * @param order The sort order.
   */
  order(order: Maybe<OrderBy>): this {
    get(this, searchParamsSymbol).orderby(order!)
    return this;
  }

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
   * @see {queryBuilder}
   * @see {QueryStringBuilder}
   */
  query(query: MaybeString): this {
    get(this, searchParamsSymbol).query(query!);
    return this;
  }

  /**
   * Creates the search feed params.
   * @param copy If true, return a copy of the created params.
   */
  build(copy?: boolean): Partial<RequestFeedParams> {
    const params = get(this, searchParamsSymbol) as SearchParams;
    return copy ? SearchParamsBuilder.from(params.source, true)
      .build() : params.source;
  }
}

/**
 * Creates an empty search params builder.
 */
export function paramsBuilder() {
  return SearchParamsBuilder.empty();
}
