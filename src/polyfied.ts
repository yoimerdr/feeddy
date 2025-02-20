import {writeable} from "../lib/jstls/src/core/definer";
import {fetch} from "../lib/jstls/src/core/polyfills/fetch";
import {Promise} from "../lib/jstls/src/core/polyfills/promise";

export * from "./module";
writeable(window, "fetch", fetch);
writeable(window, "Promise", Promise);
writeable(window, "SimplePromise", Promise);
