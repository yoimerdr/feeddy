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
import {ThisObjectKeys} from "../../../lib/jstls/src/types/core/objects";

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
   *
   * @example
   * builder
   *    .terms('search', 'terms')
   *    .build() // 'search|terms'
   *
   * @param term The search term.
   * @param terms Other search terms.
   */
  terms(term: string, ...terms: string[]): this;

  /**
   * Appends named search terms to the query.
   *
   * @example
   * builder
   *    .named('label', 'search', 'label')
   *    .build() // 'label:search|label:label'
   * @param name The name of the search terms.
   * @param term The search term.
   * @param terms Other search terms.
   */
  named(name: string, term: string, ...terms: string[]): this;

  /**
   * Appends label search terms to the query.
   *
   * @example
   * builder.label(label) // .named('label', label)
   *
   * @param label The label names.
   * @param labels Other label names
   * @see {named}
   * @since 1.2
   */
  label(label: string, ...labels: string[]): this;

  /**
   * Appends category search terms to the query.
   *
   * @param category The category name.
   * @param categories Other category names.
   * @see {label}
   * @remarks This is an alias for {@link label}
   */
  categories(category: string, ...categories: string[]): this;

  /**
   * Appends label search terms to the query.
   *
   * @param label The label name.
   * @param labels Other label names.
   * @see {label}
   * @remarks This is an alias for {@link label}
   */
  labels(label: string, ...labels: string[]): this;

  /**
   * Appends author search terms to the query.
   *
   * @example
   * builder.author(author) // .named('author', author)
   *
   * @param author The author name.
   * @param authors Other author names.
   * @see {named}
   * @since 1.2
   */
  author(author: string, ...authors: string[]): this;

  /**
   * Appends title search terms to the query.
   *
   * @example
   * builder.title(title) // .title('title', title)
   *
   * @param title The entry title.
   * @param titles Other entry titles.
   * @since 1.2
   */
  title(title: string, ...titles: string[]): this;

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
    return this;

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

function setFn(symbol: string, value: any) {
  return function (this: QueryStringBuilder,) {
    set(this, symbol, value);
    return this;
  }
}

const prototype: Partial<ThisObjectKeys<QueryStringBuilder>> = {
  and: setFn(operatorSymbol, "AND"),
  or: setFn(operatorSymbol, 'OR'),
  exact: setFn(exactSymbol, true),
  noExact: setFn(exactSymbol, false),
  exclude: setFn(excludeSymbol, true),
  noExclude: setFn(excludeSymbol, false),
  terms(...term) {
    return apply(appendQuery, this, [arguments]);
  },
  named(name, ...term) {
    return apply(appendQuery, this, [slice(arguments, 1), name]);
  },
  build(): MaybeString {
    const query: string = get(this, querySymbol);
    return apply(isEmpty, query) ? undefined : query;
  }
}

const named = ["label", "title", "author"]
  .map(function (key) {
    const handler = function (this: QueryStringBuilder, ...values: string[]) {
      return apply(this.named, this, <any>[key].concat(slice(arguments)))
    }
    set(prototype, key, handler);
    return handler;
  });

prototype["labels"] = prototype["categories"] = named[0];

es5class(QueryStringBuilder, {
  prototype
})

/**
 * Creates a new query string builder.
 */
export function queryBuilder() {
  return new QueryStringBuilder();
}
