import {uid} from "../../../lib/jstls/src/core/polyfills/symbol";
import {KeyableObject} from "../../../lib/jstls/src/types/core/objects";
import {rep} from "./representation";
import {string} from "../../../lib/jstls/src/core/objects/handlers";
import {get, set} from "../../../lib/jstls/src/core/objects/handlers/getset";
import {getDefined} from "../../../lib/jstls/src/core/objects/validators";
import {slice} from "../../../lib/jstls/src/core/iterable";
import {apply} from "../../../lib/jstls/src/core/functions/apply";
import {MaybeString} from "../../../lib/jstls/src/types/core";
import {writeables} from "../../../lib/jstls/src/core/definer";
import {isEmpty, isNotEmpty} from "../../../lib/jstls/src/core/extensions/shared/iterables";
import {len} from "../../../lib/jstls/src/core/shortcuts/indexable";

const querySymbol = uid('QueryStringBuilder#Query');
const excludeSymbol = uid('QueryStringBuilder#Exclude');
const operatorSymbol = uid('QueryStringBuilder#Operator');
const exactSymbol = uid('QueryStringBuilder#Exact');


function buildQuery(terms: string | string[], sep: string, startQuote: string, endQuote?: string): string {
  if (!Array.isArray(terms))
    return buildQuery([terms], sep, startQuote, endQuote);
  endQuote = getDefined(endQuote, () => startQuote);
  terms = terms.map(it => string(it))
    .filter(it => apply(isNotEmpty, it));
  return apply(isEmpty, terms) ? '' : `${startQuote}${terms.join(sep)}${endQuote}`
}

function appendQuery(this: QueryStringBuilder, args: ArrayLike<any>, name?: string) {
  if (len(args) === 0)
    return;

  const quote = rep.quote(get(this, exactSymbol));
  const op = rep.operator(get(this, operatorSymbol));
  const xc = get(this, excludeSymbol) ? rep.exclude() : '';
  name = string(name);
  name = apply(isNotEmpty, name) ? name + ':' : '';

  let current: string = get(this, querySymbol);

  const query = buildQuery(slice(args), quote + op + xc + name + quote, xc + name + quote, quote);

  if (apply(isNotEmpty, current))
    current += op;

  current += query;

  (this as KeyableObject)[querySymbol] = current;

  return this;
}

/**
 * @class
 * The builder for create a search query string.
 */
export class QueryStringBuilder {

  constructor() {
    const symbols: KeyableObject = {};
    symbols[exactSymbol] = false;
    symbols[operatorSymbol] = 'OR';
    symbols[excludeSymbol] = false;
    symbols[querySymbol] = '';

    writeables(this as QueryStringBuilder, symbols);
  }

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
  and(): this {
    set(this, operatorSymbol, 'AND');
    return this;
  }

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
  or(): this {
    set(this, operatorSymbol, 'OR');
    return this;
  }

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
  exact(): this {
    set(this, exactSymbol, true);
    return this;
  }

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
  noExact(): this {
    set(this, exactSymbol, false);
    return this;
  }

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
  exclude(): this {
    set(this, excludeSymbol, true);
    return this;
  }

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
  noExclude(): this {
    set(this, excludeSymbol, false);
    return this;
  }

  /**
   * Appends search terms to the query.
   * @param term The search term.
   */
  terms(...term: string[]): this {
    apply(appendQuery, this, [arguments])
    return this;
  }

  /**
   * Appends named search terms to the query.
   * @param name The name of the search terms.
   * @param term The search term.
   */
  named(name: string, ...term: string[]): this {
    apply(appendQuery, this, [slice(arguments, 1), name])
    return this;
  }

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
  categories(...category: string[]): this {
    return apply(this.named, this, <any>['label'].concat(slice(arguments)))
  }

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
  labels(...label: string[]): this {
    return apply(this.categories, this, <any>arguments);
  }

  /**
   * Returns the built query string. If It's empty, an undefined value is returned.
   */
  build(): MaybeString {
    const query: string = get(this, querySymbol);
    return apply(isEmpty, query) ? undefined : query;
  }
}

/**
 * Creates a new query string builder.
 */
export function queryBuilder() {
  return new QueryStringBuilder();
}
