import {writeable} from "@jstls/core/definer";
import {fetch} from "@jstls/core/polyfills/fetch";
import {Promise} from "@jstls/core/polyfills/promise";

export * from "./module";
writeable(window, "fetch", fetch);
writeable(window, "Promise", Promise as PromiseConstructor);
writeable(window, "SimplePromise", Promise);
