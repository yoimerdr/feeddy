import {ImageSize, SimpleSize} from "@feeddy/types/feeds/shared";
import {string} from "@jstls/core/objects/handlers";
import {isObject} from "@jstls/core/objects/types";
import {concat} from "@jstls/core/shortcuts/indexable";
import {parseSize} from "@jstls/core/geometry/size/shared";
import {round} from "@jstls/core/shortcuts/math";
import {BasePostEntry} from "@feeddy/types/feeds/posts";
import {self} from "@jstls/core/definer/getters/builders";
import {get} from "@jstls/core/objects/handlers/getset";

export const thumbnailSizeExpression: string = 's72-c';

function toFormatSize(size: ImageSize<number> | number | string): string {
  return isObject(size) ? concat("", (<ImageSize<number>>size).width, ":", (<ImageSize<number>>size).height) : string(size);
}

export function postThumbnail(source: BasePostEntry | string, size: ImageSize<number> | number | string, ratio?: string | number): string {
  const parse = parseSize<SimpleSize>(function (width, height) {
    const $this = this;
    $this.height = round(height);
    $this.width = round(width);
    $this.adjust = self();
    $this.ratio = function () {
      return $this.height === 0 ? 0 : $this.width / $this.height;
    }

  }, isObject, toFormatSize(size), ratio || 16 / 9);
  const expression = concat("w", parse.width, "-h", parse.height, "-p-k-no-nu"),
    sizeMatch = new RegExp(concat("\/(", thumbnailSizeExpression, "|s[0-9]+)", "\/")),
    legacyMatch = new RegExp(concat("=(", thumbnailSizeExpression, "|s[0-9]+)",));

  source = (get(source as BasePostEntry, "media$thumbnail", "url") || string(source)) as string;

  return source
    .replace(sizeMatch, concat("/", expression, "/"),)
    .replace(legacyMatch, concat("=", expression));
}
