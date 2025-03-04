import {queryBuilder, QueryStringBuilder, QueryStringBuilderConstructor} from "../search/query";
import {
  paramsBuilder,
  SearchParams,
  SearchParamsBuilder,
  SearchParamsBuilderConstructor,
  SearchParamsConstructor
} from "../search";

export type {
  QueryStringBuilder,
  SearchParamsBuilder,
  SearchParamsBuilderConstructor,
  SearchParamsConstructor,
  QueryStringBuilderConstructor,
  SearchParams
};

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
