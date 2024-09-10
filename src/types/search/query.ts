import {QueryOperator} from "../feeds/shared";

export interface QueryStringBuilderInfo {
  readonly operator: QueryOperator;
  readonly exact: boolean;
  readonly exclude: boolean;
}
