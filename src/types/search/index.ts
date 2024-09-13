import {QueryStringBuilder, queryBuilder} from "../../search/query/builder";
import {SearchParamsBuilder, paramsBuilder} from "../../search";

export type {QueryStringBuilder};
export type {SearchParamsBuilder};

export interface Search {
  query: typeof queryBuilder;
  QueryStringBuilder: typeof QueryStringBuilder;
  params: typeof paramsBuilder;
  SearchParamsBuilder: typeof SearchParamsBuilder;
}
