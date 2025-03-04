import {ImageSize} from "../types/feeds/shared";
import {string} from "../../lib/jstls/src/core/objects/handlers";
import {isObject} from "../../lib/jstls/src/core/objects/types";
import {concat} from "../../lib/jstls/src/core/shortcuts/string";
import {parseSize} from "../../lib/jstls/src/core/geometry/size/size";
import {KeyableObject} from "../../lib/jstls/src/types/core/objects";
import {round} from "../../lib/jstls/src/core/shortcuts/math";
import {BasePostEntry} from "../types/feeds/posts";

export const thumbnailSizeExpression: string = 's72-c';

function toFormatSize(size: ImageSize<number> | number | string): string {
  return isObject(size) ? concat("", (<ImageSize<number>>size).width, ":", (<ImageSize<number>>size).height) : string(size);
}

export function postThumbnail(source: BasePostEntry, size: ImageSize<number> | number | string, ratio?: string | number): string {
  const parse = parseSize(<any>function (this: KeyableObject, width: number, height: number) {
    this.width = round(width);
    this.height = round(height);
    this.adjust = function () {
      return this;
    }
    this.ratio = function () {
      return this.height === 0 ? 0 : this.width / this.height;
    }

  }, isObject, toFormatSize(size), ratio || 16 / 9);
  const expression = concat("w", parse.width, "-h", parse.height, "-p-k-no-nu");
  return source.media$thumbnail
    .url.replace(concat("/", thumbnailSizeExpression, "/"), concat("/", expression, "/"),)
    .replace(concat("=", thumbnailSizeExpression), concat("=", expression));
}
