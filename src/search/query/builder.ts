import {uid} from "@jstls/core/polyfills/symbol";
import {string} from "@jstls/core/objects/handlers";
import {get, set} from "@jstls/core/objects/handlers/getset";
import {slice} from "@jstls/core/iterable";
import {apply} from "@jstls/core/functions/apply";
import {MaybeString} from "@jstls/types/core";
import {writeable} from "@jstls/core/definer";
import {isEmpty, isNotEmpty} from "@jstls/core/extensions/shared/iterables";
import {exclude, operator, quote} from "./representation";
import {isArray} from "@jstls/core/shortcuts/array";
import {concat} from "@jstls/core/shortcuts/indexable";
import {ThisObjectKeys} from "@jstls/types/core/objects";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {getDefined} from "@jstls/core/objects/validators";
import {returns} from "@jstls/core/utils";
import {indefinite} from "@jstls/core/utils/types";


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
   * builder.title(title) // .named('title', title)
   *
   * @param title The entry title.
   * @param titles Other entry titles.
   * @since 1.2
   */
  title(title: string, ...titles: string[]): this;

  /**
   * Appends link search terms to the query.
   *
   * @example
   * builder.link("post-title") // .named("link", "post-title")
   *
   * @param link A word of the entry link.
   * @param links Other words of the entry link.
   *
   * @since 1.2.1
   */
  link(link: string, ...links: string[]): this;

  /**
   * Appends link search terms to the query.
   *
   * @param url A word of the entry link.
   * @param urls Other words of the entry link.
   *
   * @since 1.2.1
   * @remarks This is an alias for {@link link}
   */
  url(url: string, ...urls: string[]): this;

  /**
   * Clears the query string.
   *
   * @param reset Whether want to return to the initial state of the builder
   *
   * @sice 1.2.1
   */
  clear(reset?: boolean): this;

  /**
   * Returns the built query string. If It's empty, an undefined value is returned.
   */
  build(): MaybeString;
}


export interface QueryStringBuilderConstructor {
  new(): QueryStringBuilder;
}

const querySymbol = uid('q'),
  excludeSymbol = uid('e'),
  operatorSymbol = uid('o'),
  exactSymbol = uid('e');

function buildQuery(terms: string | string[], sep: string, startQuote: string, endQuote?: string): string {
  terms = isArray(terms) ? terms : [terms];
  endQuote = getDefined(endQuote, returns(startQuote));
  terms = terms
    .map(string)
    .filter(isNotEmpty);
  return isEmpty(terms) ? '' : concat(startQuote, terms.join(sep), endQuote);
}

function appendQuery($this: QueryStringBuilder, args: ArrayLike<any>, name?: string): QueryStringBuilder {
  if (isEmpty(args))
    return $this;

  const qt = quote(get($this, exactSymbol)),
    op = operator(get($this, operatorSymbol)),
    xc = get($this, excludeSymbol) ? exclude() : '';

  name = string(name);
  name = isNotEmpty(name) ? concat(name, ':') : '';

  let current: string = get($this, querySymbol);

  const query = buildQuery(slice(args), concat(qt, op, xc, name, qt), concat(xc, name, qt), qt);

  isNotEmpty(current) && (current += op);

  set($this, querySymbol, current + query);
  return $this;
}

function setFn(symbol: string, value: any) {
  return function (this: QueryStringBuilder,): QueryStringBuilder {
    const $this = this;
    set($this, symbol, value);
    return $this;
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
    return appendQuery(this, arguments);
  },
  named(name, ...term) {
    return appendQuery(this, slice(arguments, 1), name);
  },
  build(): MaybeString {
    const query: string = get(this, querySymbol);
    return isEmpty(query) ? indefinite : query;
  },
  clear(reset) {
    const $this = this;
    if(reset) {
      set($this, querySymbol, "");
      set($this, operatorSymbol, "OR");
      set($this, excludeSymbol, false);
      set($this, exactSymbol, false);
    }

    return $this;
  }
}

const named = ["label", "title", "author", "link"]
  .map(function (key) {
    const handler = function (this: QueryStringBuilder, ...values: string[]) {
      const $this = this;
      return apply($this.named, $this, <any> concat([key], slice(arguments)))
    }
    set(prototype, key, handler);
    return handler;
  });

prototype["labels"] = prototype["categories"] = named[0];
prototype["url"] = named[3];

export const QueryStringBuilder: QueryStringBuilderConstructor = funclass2({
  construct: function () {
    const $this = this;

    writeable($this, exactSymbol, false);
    writeable($this, operatorSymbol, 'OR');
    writeable($this, excludeSymbol, false);
    writeable($this, querySymbol, '');
  },
  prototype,
})

export function queryBuilder() {
  return new QueryStringBuilder();
}
