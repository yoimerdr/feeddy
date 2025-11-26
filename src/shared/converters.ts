import {string} from "@jstls/core/objects/handlers";
import {isObject} from "@jstls/core/objects/types";
import {toInt} from "@jstls/core/extensions/string";
import {apply} from "@jstls/core/functions/apply";
import {isArray} from "@jstls/core/shortcuts/array";
import {get, setTo} from "@jstls/core/objects/handlers/getset";
import {self} from "@jstls/core/utils";
import {
  RawBaseBlog,
  RawBaseEntry,
  RawBaseEntryBlog,
  RawBaseSimpleFeed,
  RawCategory,
  RawText
} from "@feeddy/types/feeds/raw/entry";
import {BaseBlog, BaseEntry, BaseEntryBlog, BaseSimpleFeed, SimpleText} from "@feeddy/types/feeds/entry";
import {RawAuthor} from "@feeddy/types/feeds/raw/author";
import {Author} from "@feeddy/types/feeds/author";
import {PostThumbnail} from "@feeddy/types/feeds/posts";
import {KeyableObject} from "@jstls/types/core/objects";
import {nullable} from "@jstls/core/utils/types";
import {Maybe} from "@jstls/types/core";

export function rawTextToText(text: RawText): SimpleText {
  return string(get(text, '$t'));
}

export function rawTextToNumber(text: RawText): number {
  return toInt(nullable, rawTextToText(text))!;
}

export function rawTextToBoolean(text: RawText): boolean {
  return Boolean(rawTextToText(text))
}

export function rawCategoryToCategory(text: RawCategory): SimpleText {
  return string(get(text, 'term'));
}

export function rawCategoriesToCategories(category: RawCategory[]): string[] {
  return isArray(category) ? category.map(rawCategoryToCategory) : [];
}

export function rawAuthorToAuthor(author: RawAuthor): Author {
  return setTo<RawAuthor, Author>(author, {
    email: rawTextToText,
    name: rawTextToText,
    uri: rawTextToText,
    gd$image: self
  }, {})
}

export function rawAuthorsToAuthors(author: RawAuthor[]): Author[] {
  return isArray(author) ? author
    .map(rawAuthorToAuthor) : [];
}

export function rawEntryToEntry<T extends RawBaseEntry, R extends BaseEntry>(post: T): R {
  if (!isObject(post))
    return {} as R;
  return setTo<T & KeyableObject, R>(post, {
    id: rawTextToText,
    author: rawAuthorsToAuthors,
    title: rawTextToText,
    link: self,
    updated: rawTextToText,
    published: rawTextToText,
    /*post property*/
    category: rawCategoriesToCategories,
    media$thumbnail: (value: PostThumbnail) => ({
      width: apply(toInt, value.width),
      height: apply(toInt, value.height),
      url: value.url
    }),
    content: rawTextToText,
    summary: rawTextToText,
    thr$total: rawTextToNumber,
    /*comments property*/
    "thr$in-reply-to": self,
    gd$extendedProperty: self
  }, {})
}

export function rawBlogEntryToBlogEntry<T extends RawBaseEntryBlog, R extends BaseEntryBlog>(blog: T): R {
  return setTo<T & KeyableObject, R>(blog, {
    version: self,
    encoding: self,
    entry: rawEntryToEntry
  }, {});
}

export function rawFeedToFeed<T extends RawBaseSimpleFeed, R extends BaseSimpleFeed>(feed: T): R {
  const res: any = rawEntryToEntry(feed as any);
  setTo<RawBaseSimpleFeed & KeyableObject, BaseSimpleFeed>(feed, {
    blogger$adultContent: rawTextToBoolean,
    subtitle: rawTextToText,
    openSearch$itemsPerPage: rawTextToNumber,
    openSearch$startIndex: rawTextToNumber,
    openSearch$totalResults: rawTextToNumber,
    entry: (value: Maybe<RawBaseEntry[]>) => isArray(value) ? value.map(rawEntryToEntry) : [],
  }, res)
  return res;
}

export function rawBlogToBlog<T extends RawBaseBlog, R extends BaseBlog>(blog: T): R {
  return setTo<T & KeyableObject, R>(blog, {
    version: self,
    encoding: self,
    feed: rawFeedToFeed
  }, {})
}
