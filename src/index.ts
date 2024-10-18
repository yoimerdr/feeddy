import {Posts} from "./types/posts";
import {MaybeNumber} from "../lib/jstls/src/types/core";

export * from "./module";
/**
 * The handler to paginate the blogger feed posts.
 */
export declare const posts: Posts;

declare global {
  interface Number {
    /**
     * Restricts the number to be at least the given minimum.
     *
     * @param {number} minimum - The minimum value.
     * @returns {number} The coerced number, which is the largest of the original number or the minimum.
     */
    coerceAtLeast(minimum: number): number

    /**
     * Restricts the number to be within the given range [minimum, maximum].
     *
     * @param {number} minimum - The minimum value.
     * @param {number} maximum - The maximum value.
     * @returns {number} The coerced number, which will be within the range [minimum, maximum].
     */
    coerceIn(minimum: number, maximum: number): number
  }

  interface String {
    /**
     * Checks if the string is empty
     * @returns {boolean} true if string is empty; otherwise false
     */
    isEmpty(): boolean;

    /**
     * Checks if the string is not empty
     * @returns {boolean} true if string is not empty; otherwise false
     */
    isNotEmpty(): boolean;

    toInt(radix?: number): MaybeNumber;
  }

  interface Array<T> {

    /**
     * Check if array is empty
     *
     * @returns {boolean} true if array is empty; otherwise false
     */
    isEmpty(): boolean

    /**
     * Check if array is not empty
     * @returns {boolean} true if array is not empty; otherwise false
     */
    isNotEmpty(): boolean

    /**
     * Extend current array pushing each element from source array
     * @template T
     *
     * @param {T[]} source An array with elements for extend current array.
     */
    extends(source: T[]): this;
  }
}
