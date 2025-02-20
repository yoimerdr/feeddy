import {
  RawAuthor,
  RawBlog,
  RawBlogFeed,
  RawCategory,
  RawPostCategory,
  RawPostEntry,
  RawPostEntrySummary,
  RawText
} from "../types/feeds/raw";
import {Author, Blog, BlogFeed, PostEntry, PostEntrySummary, SimpleText} from "../types/feeds";
import {string} from "../../lib/jstls/src/core/objects/handlers";
import {isObject} from "../../lib/jstls/src/core/objects/types";
import {toInt} from "../../lib/jstls/src/core/extensions/string";
import {apply} from "../../lib/jstls/src/core/functions/apply";
import {isArray} from "../../lib/jstls/src/core/shortcuts/array";
import {setTo} from "../../lib/jstls/src/core/objects/handlers/getset";
import {self} from "../../lib/jstls/src/core/utils";

export function rawTextToText(text: RawText): SimpleText {
  return isObject(text) ? string(text.$t) : '';
}

export function rawTextToNumber(text: RawText): number {
  return apply(toInt, rawTextToText(text))!;
}

export function rawTextToBoolean(text: RawText): boolean {
  return Boolean(rawTextToText(text))
}

export function rawCategoryToCategory(category: RawCategory[] | RawPostCategory[]): string[] {
  return isArray(category) ? category.map(it => it.term) : [];
}

export function rawAuthorToAuthor(author: RawAuthor[]): Author[] {
  return isArray(author) ? author
    .map(value => setTo<RawAuthor, Author>(value, {
      email: rawTextToText,
      name: rawTextToText,
      uri: rawTextToText,
      gd$image: self
    }, {})) : [];
}

export function rawPostToPost(post: RawPostEntry): PostEntry;
export function rawPostToPost(post: RawPostEntrySummary): PostEntrySummary;
export function rawPostToPost(post: RawPostEntry | RawPostEntrySummary): PostEntry | PostEntrySummary;
export function rawPostToPost(post: RawPostEntry | RawPostEntrySummary): PostEntry | PostEntrySummary {
  if (!isObject(post))
    return {} as PostEntry;
  return setTo<RawPostEntry & RawPostEntrySummary, PostEntry>(post as any, {
    id: rawTextToText,
    author: rawAuthorToAuthor,
    title: rawTextToText,
    link: self,
    category: rawCategoryToCategory,
    media$thumbnail: (value) => ({
      width: apply(toInt, value.width),
      height: apply(toInt, value.height),
      url: value.url
    }),
    updated: rawTextToText,
    published: rawTextToText,
    content: rawTextToText,
    summary: rawTextToText
  }, {})
}

export function rawBlogToBlog(blog: RawBlog): Blog {
  return setTo<RawBlog, Blog>(blog, {
    version: self,
    encoding: self,
    feed: (feed) => {
      return setTo<RawBlogFeed, BlogFeed>(feed, {
        id: rawTextToText,
        author: rawAuthorToAuthor,
        category: rawCategoryToCategory,
        blogger$adultContent: rawTextToBoolean,
        title: rawTextToText,
        subtitle: rawTextToText,
        updated: rawTextToText,
        openSearch$itemsPerPage: rawTextToNumber,
        openSearch$startIndex: rawTextToNumber,
        openSearch$totalResults: rawTextToNumber,
        link: self,
        entry: (value) => isArray(value) ? value.map(rawPostToPost) : [],
      }, {})
    }
  }, {})
}
