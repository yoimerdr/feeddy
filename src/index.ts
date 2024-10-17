import {Posts} from "./types/posts";
import {NumberExtensions} from "../lib/jstls/src/types/core/extensions/number";
import {StringExtensions} from "../lib/jstls/src/types/core/extensions/string";
import {ArrayExtensions} from "../lib/jstls/src/types/core/extensions/array";

export * from "./module";
/**
 * The handler to paginate the blogger feed posts.
 */
export declare const posts: Posts;

declare global {
  interface Number extends Pick<NumberExtensions, "coerceAtLeast" | "coerceIn"> {

  }

  interface String extends Pick<StringExtensions, "toInt" | "isEmpty" | "isNotEmpty"> {

  }

  interface Array<T> extends Pick<ArrayExtensions<T>, "isEmpty" | "isNotEmpty"> {
    /**
     * Extend current array pushing each element from source array
     * @template T
     *
     * @param {T[]} source An array with elements for extend current array.
     */
    extends(source: T[]): this;
  }
}
