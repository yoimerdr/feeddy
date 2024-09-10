import {
  RawAuthor,
  RawBlog,
  RawCategory,
  RawPostCategory,
  RawPostEntry,
  RawPostEntrySummary,
  RawText
} from "../types/feeds/raw";
import {Author, Blog, PostEntry, PostEntrySummary, Text} from "../types/feeds";
import {string} from "../../lib/jstls/src/core/objects/handlers";
import {KeyableObject} from "../../lib/jstls/src/types/core/objects";
import {IllegalArgumentError} from "../../lib/jstls/src/core/exceptions";
import {isObject} from "../../lib/jstls/src/core/objects/types";

export function rawTextToText(text: RawText): Text {
  return isObject(text) ? string(text.$t) : '';
}

export function rawTextToNumber(text: RawText): number {
  return rawTextToText(text).toInt()!;
}

export function rawTextToBoolean(text: RawText): boolean {
  return Boolean(rawTextToText(text))
}

export function rawCategoryToCategory(category: RawCategory[] | RawPostCategory[]): string[] {
  return Array.isArray(category) ? category.map(it => it.term) : [];
}

export function rawAuthorToAuthor(author: RawAuthor): Author {
  return {
    email: rawTextToText(author.email),
    name: rawTextToText(author.name),
    uri: rawTextToText(author.uri),
    gd$image: author.gd$image
  }
}

export function rawPostToPost(post: RawPostEntry): PostEntry;
export function rawPostToPost(post: RawPostEntrySummary): PostEntrySummary;
export function rawPostToPost(post: RawPostEntry | RawPostEntrySummary): PostEntry | PostEntrySummary;
export function rawPostToPost(post: RawPostEntry | RawPostEntrySummary): PostEntry | PostEntrySummary {
  if (!isObject(post))
    return {} as PostEntry;

  const base: KeyableObject = {
    id: rawTextToText(post.id),
    author: post.author.map(rawAuthorToAuthor),
    title: rawTextToText(post.title),
    link: post.link,
    category: rawCategoryToCategory(post.category),
    media$thumbnail: {
      width: post.media$thumbnail.width.toInt(),
      height: post.media$thumbnail.height.toInt(),
      url: post.media$thumbnail.url
    },
    updated: rawTextToText(post.updated),
    published: rawTextToText(post.published)
  }
  if ((<RawPostEntry>post).content)
    base.content = rawTextToText((<RawPostEntry>post).content);
  else if ((<RawPostEntrySummary>post).summary)
    base.summary = rawTextToText((<RawPostEntrySummary>post).summary);
  else throw new IllegalArgumentError("No valid post given")
  return base as PostEntry;
}

export function rawBlogToBlog(blog: RawBlog): Blog {
  const feed = blog.feed;
  return {
    version: blog.version,
    encoding: blog.encoding,
    feed: {
      id: rawTextToText(feed.id),
      author: feed.author.map(rawAuthorToAuthor),
      category: rawCategoryToCategory(feed.category),
      blogger$adultContent: rawTextToBoolean(feed.blogger$adultContent),
      title: rawTextToText(feed.title),
      subtitle: rawTextToText(feed.subtitle),
      updated: rawTextToText(feed.updated),
      openSearch$startIndex: rawTextToNumber(feed.openSearch$startIndex),
      openSearch$totalResults: rawTextToNumber(feed.openSearch$totalResults),
      openSearch$itemsPerPage: rawTextToNumber(feed.openSearch$itemsPerPage),
      entry: Array.isArray(feed.entry) ? feed.entry.map(post => rawPostToPost(post)) : [],
      link: feed.link
    }
  }
}
