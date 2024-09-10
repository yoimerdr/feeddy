import {QueryOperator} from "../../types/feeds/shared";
import {Maybe} from "../../../lib/jstls/src/types/core";

export const rep = {
  /**
   * Gets the query operator representation.
   * @param operator The query operator.
   */
  operator(operator: Maybe<QueryOperator>): string {
    return operator === 'OR' ? '|' : ' ';
  },

  /**
   * Gets the quote representation for exact or partial search terms.
   * @param exact Whether the search term is exact.
   */
  quote(exact: Maybe<boolean>): string {
    return exact ? '"' : '';
  },

  exclude(): string {
    return '-';
  }
}
