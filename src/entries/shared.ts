import {string} from "../../lib/jstls/src/core/objects/handlers";
import {indefinite} from "../../lib/jstls/src/core/utils/types";
import {isNotEmpty} from "../../lib/jstls/src/core/extensions/shared/iterables";
import {apply} from "../../lib/jstls/src/core/functions/apply";
import {findLast} from "../../lib/jstls/src/core/polyfills/indexable/es2023";
import {RawEntryLink} from "../types/feeds/raw/entry";
import {reduceText} from "../../lib/jstls/src/core/utils";
import {get} from "../../lib/jstls/src/core/objects/handlers/getset";
import {BaseEntry} from "../types/feeds/entry";


export function entryPathname(source: Partial<BaseEntry> | string, length?: number): string {
  const links = get(source as BaseEntry, "link");
  let link: any = indefinite!;
  if (links && isNotEmpty(links)) {
    link = apply(findLast<RawEntryLink>, links, [(value) => value.rel === "alternate"]);
    if (link)
      return link.href
        .split("/")
        .pop()!
        .replace(".html", "");
  }

  link = get(source as BaseEntry, "title",) || string(source);
  return reduceText(link, length, /\W/, "-").toLowerCase()
}
