import {SearchParams, SearchParamsBuilder} from "@feeddy/search";

export interface ParamsNamespace {
  (): SearchParamsBuilder;

  /**
   * Constructor for search parameter builder instances.
   * @class
   */
  Builder: typeof SearchParamsBuilder;

  /**
   * Constructor for search parameters handler.
   * @class
   */
  Params: typeof SearchParams
}
