import {writeables} from "../lib/jstls/src/core/definer";
import {fetch} from "../lib/jstls/src/core/polyfills/fetch";
import {Promise} from "../lib/jstls/src/core/polyfills/promise";

export * from "./module";
writeables(window, {
  fetch,
  Promise,
  SimplePromise: Promise
})
