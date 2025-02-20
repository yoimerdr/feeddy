import {uid} from "../../../lib/jstls/src/core/polyfills/symbol";
import {string} from "../../../lib/jstls/src/core/objects/handlers";
import {get, set} from "../../../lib/jstls/src/core/objects/handlers/getset";
import {slice} from "../../../lib/jstls/src/core/iterable";
import {apply} from "../../../lib/jstls/src/core/functions/apply";
import {MaybeString} from "../../../lib/jstls/src/types/core";
import {writeable} from "../../../lib/jstls/src/core/definer";
import {isEmpty, isNotEmpty} from "../../../lib/jstls/src/core/extensions/shared/iterables";
import {len} from "../../../lib/jstls/src/core/shortcuts/indexable";
import {exclude, operator, quote} from "./representation";
import {isArray} from "../../../lib/jstls/src/core/shortcuts/array";
import {es5class} from "../../../lib/jstls/src/core/definer/classes";
import {concat} from "../../../lib/jstls/src/core/shortcuts/string";

const querySymbol = uid('q');
const excludeSymbol = uid('e');
const operatorSymbol = uid('o');
const exactSymbol = uid('e');


export interface QueryStringBuilder {
  /**
   * Changes the operator to append search terms to `AND`.
   *
   *
   * @example
   * builder
   *   .labels('first')
   *   .and()
   *   .labels('second')
   *   .build() // 'label:first label:second'
   *
   * @see {or}
   */
  and(): this;

  /**
   * Changes the operator to append search terms to `OR`.
   *
   * @example
   * builder
   *   .labels('first')
   *   .or()
   *   .labels('second')
   *   .build() // 'label:first|label:second'
   *
   * @see {and}
   */
  or(): this;

  /**
   * Sets the exact mode on.
   *
   * The next search terms will be exact.
   *
   * @example
   * builder
   *   .labels('first')
   *   .and().exact()
   *   .labels('second label') // for labels with spaces, It's recommended to use exact mode.
   *   .build() // 'label:first label:"second label"'
   *
   * @see {noExact}
   */
  exact(): this;

  /**
   * Sets the exact mode off.
   *
   * The next search terms will not be exact.
   *
   * @example
   * builder
   *   .exact()
   *   .labels('first label') // for labels with spaces, It's recommended to use exact mode.
   *   .or().noExact()
   *   .labels('second')
   *   .build() // 'label:"first label"|label:second'
   *
   * @see {exact}
   */
  noExact(): this;

  /**
   * Sets the exclude mode on.
   *
   * The next search terms will be exclusive.
   *
   * @example
   * builder
   *   .labels('first')
   *   .and().exclude()
   *   .labels('second')
   *   .build() // 'label:first -label:second'
   *
   * @see {noExclude}
   */
  exclude(): this;

  /**
   * Sets the exclude mode off.
   *
   * The next search terms will not be exclusive.
   *
   * @example
   * builder
   *   .labels('first')
   *   .and().exclude()
   *   .labels('second')
   *   .noExclude()
   *   .labels('third')
   *   .build() // 'label:first -label:second label:third'
   *
   * @see {exclude}
   */
  noExclude(): this;

  /**
   * Appends search terms to the query.
   * @param term The search term.
   */
  terms(...term: string[]): this;

  /**
   * Appends named search terms to the query.
   * @param name The name of the search terms.
   * @param term The search term.
   */
  named(name: string, ...term: string[]): this;

  /**
   * Appends category search terms to the query.
   *
   * <b>Alias</b>
   * @example
   * builder.categories(...category) // .named('label', ...category)
   *
   * @param category The category o category names.
   * @see {terms}
   */
  categories(...category: string[]): this;

  /**
   * Appends category search terms to the query.
   *
   * <b>Alias</b>
   * @example
   * builder.labels(label) // .categories(label)
   *
   * @param label The category o category names.
   * @see {categories}
   */
  labels(...label: string[]): this;

  author(...author: string[]): this;

  title(...title: string[]): this;

  /**
   * Returns the built query string. If It's empty, an undefined value is returned.
   */
  build(): MaybeString;
}


export interface QueryStringBuilderConstructor {
  new(): QueryStringBuilder;
}

function buildQuery(terms: string | string[], sep: string, startQuote: string, endQuote?: string): string {
  if (!isArray(terms))
    return buildQuery([terms], sep, startQuote, endQuote);
  endQuote = endQuote || startQuote;
  terms = terms.map(it => string(it))
    .filter(it => apply(isNotEmpty, it));
  return apply(isEmpty, terms) ? '' : concat(startQuote, terms.join(sep), endQuote);
}

function appendQuery(this: QueryStringBuilder, args: ArrayLike<any>, name?: string) {
  if (len(args) === 0)
    return;

  const qt = quote(get(this, exactSymbol)), op = operator(get(this, operatorSymbol)),
    xc = get(this, excludeSymbol) ? exclude() : '';
  name = string(name);
  name = apply(isNotEmpty, name) ? concat(name, ':') : '';

  let current: string = get(this, querySymbol);

  const query = buildQuery(slice(args), concat(qt, op, xc, name, qt), concat(xc, name, qt), qt);

  if (apply(isNotEmpty, current))
    current += op;

  current += query;

  set(this, querySymbol, current);
  return this;
}

export const QueryStringBuilder: QueryStringBuilderConstructor = function (this: QueryStringBuilder) {
  writeable(this, exactSymbol, false);
  writeable(this, operatorSymbol, 'OR');
  writeable(this, excludeSymbol, false);
  writeable(this, querySymbol, '');
} as any;

function categories(this: QueryStringBuilder, ...category: string[]) {
  return apply(this.named, this, <any>["label"].concat(slice(arguments)))
}

es5class(QueryStringBuilder, {
  prototype: {
    and() {
      set(this, operatorSymbol, 'AND');
      return this;
    },
    or() {
      set(this, operatorSymbol, 'OR');
      return this;
    },
    exact() {
      set(this, exactSymbol, true);
      return this;
    },
    noExact() {
      set(this, exactSymbol, false);
      return this;
    },
    exclude() {
      set(this, excludeSymbol, true);
      return this;
    },
    noExclude() {
      set(this, excludeSymbol, false);
      return this;
    },
    terms(...term: string[]) {
      apply(appendQuery, this, [arguments])
      return this;
    },
    named(name: string, ...term: string[]) {
      apply(appendQuery, this, [slice(arguments, 1), name])
      return this;
    },
    categories,
    labels: categories,
    author(...author) {
      return apply(this.named, this, <any>["author"].concat(slice(arguments)))
    },
    title(...title) {
      return apply(this.named, this, <any>["title"].concat(slice(arguments)))
    },
    build(): MaybeString {
      const query: string = get(this, querySymbol);
      return apply(isEmpty, query) ? undefined : query;
    }
  }
})

/**
 * Creates a new query string builder.
 */
export function queryBuilder() {
  return new QueryStringBuilder();
}
