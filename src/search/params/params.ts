import {Keys, Maybe, MaybeString, Nullables} from "../../../lib/jstls/src/types/core";
import {string} from "../../../lib/jstls/src/core/objects/handlers";
import {isDefined} from "../../../lib/jstls/src/core/objects/types";
import {assign2} from "../../../lib/jstls/src/core/objects/factory";
import {ThisObjectKeys} from "../../../lib/jstls/src/types/core/objects";
import {readonly2,} from "../../../lib/jstls/src/core/definer";
import {call} from "../../../lib/jstls/src/core/functions/call";
import {toInt} from "../../../lib/jstls/src/core/extensions/string";
import {apply} from "../../../lib/jstls/src/core/functions/apply";
import {coerceAtLeast} from "../../../lib/jstls/src/core/extensions/number";
import {len} from "../../../lib/jstls/src/core/shortcuts/indexable";
import {forEach} from "../../../lib/jstls/src/core/shortcuts/array";
import {Alt, OrderBy, RequestFeedParams} from "../../types/feeds/shared/params";
import {set} from "../../../lib/jstls/src/core/objects/handlers/getset";
import {concat} from "../../../lib/jstls/src/core/shortcuts/string";
import {dateTypes} from "../shared";
import {includes} from "../../../lib/jstls/src/core/polyfills/indexable/es2016";
import {deletes} from "../../../lib/jstls/src/core/objects/handlers/deletes";
import {funclass2} from "../../../lib/jstls/src/core/definer/classes/funclass";
import {indefinite} from "../../../lib/jstls/src/core/utils/types";


export interface SearchParams {
  /**
   * The search parameters.
   */
  readonly source: Partial<RequestFeedParams>;

  /**
   * Gets the `max-results` parameter.
   * @see {RequestFeedParams.max-results}
   */
  max(): number;

  /**
   * Sets and gets the `max-results` parameter.
   * @see {RequestFeedParams.max-results}
   * @param max The new max value.
   */
  max(max: string | number): number;

  /**
   * Gets the `start-index` parameter.
   * @see {RequestFeedParams.start-index}
   */
  start(): number;

  /**
   * Sets and gets the `start-index` parameter.
   * @see {RequestFeedParams.start-index}
   * @param index The new start index.
   */
  start(index: string | number): number;

  /**
   * Gets the `published-min` parameter.
   *
   * @see {RequestFeedParams.published-min}
   */
  publishedAtLeast(): MaybeString;

  /**
   * Sets and gets the `published-min` parameter.
   * @see {RequestFeedParams.published-min}
   * @param min The new date.
   */
  publishedAtLeast(min: string): string;

  /**
   * Removes the `published-min` parameter.
   * @see {RequestFeedParams.published-min}
   */
  publishedAtLeast(min: Nullables): Nullables;

  publishedAtLeast(min?: MaybeString): MaybeString;

  /**
   * Removes the `published-max` parameter.
   * @see {RequestFeedParams.published-max}
   */
  publishedAtMost(max: Nullables): Nullables;

  /**
   * Gets the `published-max` parameter.
   * @see {RequestFeedParams.published-max}
   */
  publishedAtMost(): MaybeString;

  /**
   * Sets and gets the `published-max` parameter.
   * {@link RequestFeedParams.published-max}
   * @param max The new date.
   */
  publishedAtMost(max: string): string;

  publishedAtMost(max?: MaybeString): MaybeString

  /**
   * Gets the `updated-min` parameter.
   * @see {RequestFeedParams.updated-min}
   */
  updatedAtLeast(): MaybeString;

  /**
   * Sets and gets the `updated-min` parameter.
   * @see {RequestFeedParams.updated-min}
   * @param min The new date.
   */
  updatedAtLeast(min: string): string;

  /**
   * Removes the `updated-min` parameter.
   * @see {RequestFeedParams.updated-min}
   */
  updatedAtLeast(min: Nullables): Nullables;

  updatedAtLeast(min?: MaybeString): MaybeString

  /**
   * Gets the `updated-max` parameter.
   * @see {RequestFeedParams.updated-max}
   */
  updatedAtMost(): MaybeString;

  /**
   * Sets and gets the `updated-max` parameter.
   * @see {RequestFeedParams.updated-max}
   * @param max The new date.
   */
  updatedAtMost(max: string): string;

  /**
   * Removes the `updated-max` parameter.
   * @see {RequestFeedParams.updated-max}
   */
  updatedAtMost(max: Nullables): Nullables;

  updatedAtMost(max?: MaybeString): MaybeString

  /**
   * Gets the `orderby` parameter.
   * @see {RequestFeedParams.orderby}
   */
  orderby(): OrderBy;

  /**
   * Sets and gets the `orderby` parameter.
   *
   * The value assigned will be the default one: `updated`.
   * @see {RequestFeedParams.orderby}
   */
  orderby(order: Nullables): 'updated';

  /**
   * Sets and gets the `orderby` parameter.
   * @see {RequestFeedParams.orderby}
   * @param order The new order.
   */
  orderby<O extends OrderBy>(order: O): O;

  orderby<O extends OrderBy>(order?: O): O;

  /**
   * Gets the `q` parameter.
   * @see {RequestFeedParams.q}
   * @see {QueryStringBuilder}
   */
  query(): MaybeString;

  /**
   * Sets and gets the `q` parameter.
   * @see {RequestFeedParams.q}
   * @see {QueryStringBuilder}
   * @param query The new query.
   */
  query(query: string): string;

  /**
   * Removes the `q` parameter.
   */
  query(query: Nullables): Nullables;

  query(query?: MaybeString): MaybeString;

  /**
   * Gets the `alt` parameter.
   * @see {RequestFeedParams.alt}
   */
  alt(): Alt;

  /**
   * Sets and gets the `q` parameter.
   * @see {RequestFeedParams.alt}
   */
  alt<A extends Alt>(type: A): A;

  /**
   * Sets and gets the `alt` parameter.
   *
   * The value assigned will be the default one: `json`.
   * @see {RequestFeedParams.alt}
   */
  alt(type: Nullables): "json";

  /**
   * Gets the `alt` parameter.
   * @see {RequestFeedParams.alt}
   */
  alt(type?: Maybe<Alt>): Alt;

  /**
   * Creates a new object with only the defined parameters.
   *
   * @deprecated Since 1.2 undefined or null values deletes the property from the source. Use `source` instead.
   *
   * @example
   * var params = new SearchParams();
   * params.query("title") // { source: { q: 'title' } }
   * params.max(9) // { source: { q: 'title', "max-results": 12 } }
   * params.query(undefined) // { source: { q: undefined, "max-results": 12 } }
   * var source = params.toDefined(); // { "max-results": 12 }
   *
   * @see {source}
   */
  toDefined(): Partial<RequestFeedParams>;
}

export interface SearchParamsConstructor {
  /**
   * Instances a new search params.
   * @param source The source params.
   */
  new(source?: Partial<RequestFeedParams>): SearchParams;

  /**
   * Creates a new search parameters object.
   * @param source The search parameters or other SearchParams instance.
   * @param copy Whether to copy the search parameters.
   * @static
   */
  from(source?: Partial<RequestFeedParams> | SearchParams, copy?: boolean): SearchParams;
}


function minimumsOne(max: Maybe<string | number>): number {
  max = call(toInt, string(max));
  return isDefined(max) ? apply(coerceAtLeast, max!, [1]) : 1;
}

function validDate(date: MaybeString): string {
  try {
    return new Date(date!)
      .toISOString()
  } catch (e) {
    isDefined(date) && console.error('No valid date given: ', date);
    return indefinite!;
  }
}

function updateProperty<K extends Keys<RequestFeedParams>>(args: IArguments,
                                                           source: Partial<RequestFeedParams>, key: K,
                                                           builder?: (arg: any) => RequestFeedParams[K],
                                                           allowUndefined?: boolean) {
  const value = len(args) > 0 ? args[0] : source[key];
  if (!allowUndefined && !isDefined(value))
    deletes(source, key);
  else source[key] = builder ? builder(value) : value;
  return source[key]
}


function propertyFn<K extends Keys<RequestFeedParams>>(key: K, builder?: (value: RequestFeedParams[K]) => any, allowUndefined?: boolean) {
  return function (this: SearchParams, value?: Maybe<string | number>) {
    const {source} = this;
    return updateProperty(arguments, source, key, builder, allowUndefined) as any;
  }
}

function dateProperties(type: "published" | "updated", mode: "max" | "min") {
  const suffix = mode === "max" ? "AtMost" : "AtLeast";
  set(prototype, type + suffix, function (this: SearchParams, value: MaybeString): MaybeString {
    const {source} = this, key: any = concat(type, "-", mode);
    return updateProperty(arguments, source, key, validDate)
  })
}

const prototype: Partial<ThisObjectKeys<SearchParams>> = {
  max: propertyFn("max-results", minimumsOne),
  start: propertyFn("start-index", minimumsOne),
  query: propertyFn("q"),
  alt: propertyFn("alt", (it) => call(includes, ["json", "rss", "atom"], it) ? it : 'json', true),
  orderby: propertyFn("orderby", (order) => call(includes, dateTypes, order) ? order : 'updated', true),
  toDefined(): Partial<RequestFeedParams> {
    return this.source;
  }
};

forEach(dateTypes, (key) => {
  dateProperties(key, "min")
  dateProperties(key, "max")
})

export const SearchParams: SearchParamsConstructor = funclass2({
  construct: function (source) {
    readonly2(this, "source", source || {})
  },
  statics: {
    from: paramsFrom
  },
  prototype
})

export function paramsFrom(source?: Partial<RequestFeedParams> | SearchParams, copy?: boolean): SearchParams {
  if (source instanceof SearchParams)
    return copy ? paramsFrom(source.source, copy) : source as SearchParams;
  return new SearchParams(copy ? assign2(<RequestFeedParams>{}, source!) : source);
}

