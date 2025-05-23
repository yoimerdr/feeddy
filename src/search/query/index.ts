import {FullSplitQuery} from "@/types/search";

export * from "./builder";
export * from "./representation";

/**
 * Splits the query into an object.
 *
 * @example
 * const splitted = splitQuery('label:this label:are label:label|label:terms "this is exact" this are terms author:"exact terms"')
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
export function splitQuery(query: string): FullSplitQuery {
  const result: FullSplitQuery = {
    named: {},
    exact: [],
    terms: []
  };

  const tokenRegex = /(\w+):"([^"]+)"|(\w+):(\w*)|"([^"]+)"|(\w+)/g;
  let match;

  while ((match = tokenRegex.exec(query)) !== null) {
    if (match[1] && match[2]) {
      // named:"quoted"
      const key = match[1],
        value = match[2];

      let named = result.named[key];
      named || (named = result.named[key] = {exact: [], terms: []})

      named.exact.push(value);
    } else if (match[3] && match[4]) {
      // named:term
      const key = match[3],
        value = match[4];
      let named = result.named[key];
      named || (named = result.named[key] = {exact: [], terms: []})
      named.terms.push(value);
    } else if (match[5]) {
      // "quoted"
      result.exact.push(match[5]);
    } else if (match[6]) {
      // plain term
      result.terms.push(match[6]);
    }
  }

  return result;
}
