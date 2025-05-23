import {queryBuilder, QueryStringBuilder, QueryStringBuilderConstructor} from "@/search/query/builder";
import {
  paramsBuilder,
  SearchParams,
  SearchParamsBuilder,
  SearchParamsBuilderConstructor,
  SearchParamsConstructor
} from "@/search";
import {Maybe} from "@jstls/types/core";

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

/**
 * Interface for search functionality in the blog API.
 *
 * Provides methods and types for building and manage search queries and parameters.
 */
export interface Search {
  query: typeof queryBuilder;
  params: typeof paramsBuilder;

  /**
   * Constructor for query string builder instances.
   * @class
   */
  QueryStringBuilder: QueryStringBuilderConstructor;

  /**
   * Constructor for search parameter builder instances.
   * @class
   */
  SearchParamsBuilder: SearchParamsBuilderConstructor;

  /**
   * Constructor for search parameters handler.
   * @class
   */
  SearchParams: SearchParamsConstructor;
}
