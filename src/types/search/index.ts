import {QueryStringBuilder, QueryStringBuilderConstructor} from "@feeddy/search/query/builder";
import {
  SearchParams,
  SearchParamsBuilder,
  SearchParamsBuilderConstructor,
  SearchParamsConstructor
} from "@feeddy/search";
import {Maybe} from "@jstls/types/core";
import {QueryNamespace} from "@feeddy/types/search/query";
import {ParamsNamespace} from "@feeddy/types/search/params";

export type {
  QueryStringBuilder,
  SearchParamsBuilder,
  SearchParamsBuilderConstructor,
  SearchParamsConstructor,
  QueryStringBuilderConstructor,
  SearchParams
};

export interface SplitQuery {
  /**
   * The exact query terms.
   *
   * @example
   * ['"exact terms"', '"from a query"']
   */
  exact: string[];
  /**
   * The common query terms.
   *
   * @example
   * ["common", "search", "terms"]
   */
  terms: string[];
}

export interface FullSplitQuery extends SplitQuery {
  /**
   * The named query terms.
   *
   * @example
   * {label: {exact: ['"search terms for"'], terms: ["named", "label", ]}}
   */
  named: Record<string, Maybe<SplitQuery>> & Object;
}
/** @deprecated*/
export type Search = SearchNamespace;

/**
 * Interface for search functionality in the blog API.
 *
 * Provides methods and types for building and manage search queries and parameters.
 */
export interface SearchNamespace {
  /**
   * The handler for
   */
  query: QueryNamespace;
  params: ParamsNamespace;

  /**
   * Constructor for query string builder instances.
   * @deprecated Use `.query.Builder` instead.
   * @class
   */
  QueryStringBuilder: QueryStringBuilderConstructor;

  /**
   * Constructor for search parameter builder instances.
   * @deprecated Use `.params.Builder` instead.
   * @class
   */
  SearchParamsBuilder: SearchParamsBuilderConstructor;

  /**
   * Constructor for search parameters handler.
   * @deprecated Use `.params.Params` instead.
   * @class
   */
  SearchParams: SearchParamsConstructor;
}
