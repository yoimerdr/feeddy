import {QueryStringBuilder} from "@feeddy/search/query";
import {FullSplitQuery} from "@feeddy/types/search/index";

export interface QueryNamespace {
  /**
   * Creates a new query string builder.
   */
  (): QueryStringBuilder;

  /**
   * Constructor for query string builder instances.
   * @class
   */
  Builder: typeof QueryStringBuilder;

  /**
   * Splits the query into an object.
   *
   * @example
   * const splitted = split('label:this label:are label:label|label:terms "this is exact" this are terms author:"exact terms"')
   * //{
   * //  named: {
   * //    label: { exact: [], terms: [ 'this', 'are', 'label', 'terms' ] },
   * //    author: { exact: [ 'exact terms' ], terms: [] }
   * //  },
   * //  exact: [ 'this is exact' ],
   * //  terms: [ 'this', 'are', 'terms' ]
   * //}
   * @param query The search query
   */
  split(query: string): FullSplitQuery;
}
