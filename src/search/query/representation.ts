import {Maybe, MaybeString, Nullables} from "../../../lib/jstls/src/types/core";

/**
 * Gets the query operator representation.
 * @param operator The query operator.
 */
export function operator(operator: 'AND'): ' ';
export function operator(operator: 'OR'): '|';
export function operator(operator: Nullables): '|';
export function operator(operator: string): '|';
export function operator(operator: MaybeString): '|' | ' ' {
  return operator === 'OR' ? '|' : ' ';
}

/**
 * Gets the quote representation for exact or partial search terms.
 * @param exact Whether the search term is exact.
 */
export function quote(exact: true): '"';
export function quote(exact: false): '';
export function quote(exact: Nullables): '"' | '';
export function quote(exact: Maybe<boolean>): '"' | '' {
  return exact ? '"' : '';
}

/**
 * Gets the exclude representation for search terms.
 */
export function exclude(): '-' {
  return '-';
}
