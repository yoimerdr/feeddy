import {LinkRel} from "../shared";
import {RawAuthor} from "./author";

/**
 * A string on blog's feed.
 */
export type RawText = Record<"$t", string>;

/**
 * A title on blog's feed.
 */
export type RawTextTitle = RawText & Record<"type", "text">

/**
 * A content on blog's feed.
 */
export type RawTextContent = RawText & Record<"type", "html">;

/**
 * A category on blog's feed.
 */
export type RawCategory = Record<"term", string>;


/**
 * Represents a link in the blog.
 */
export interface RawLink {

  /**
   * The relationship of the link.
   */
  rel: LinkRel;

  /**
   * The URL of the link.
   */
  href: string;

  /**
   * The MIME type of the linked resource.
   */
  type?: string;
}

/**
 * Represents a link of a blog entry.
 */
export interface RawEntryLink extends RawLink {

  /**
   * The title of the entry.
   */
  title?: string;
}

export interface RawSourceLink extends RawLink {
  source: string;
}

export interface RawBaseEntry {
  /**
   * The id of the entry.
   */
  id: RawText;

  /**
   * RFC 3339 date-time when the entry was published.
   */
  published: RawText;

  /**
   * RFC 3339 date-time when the entry was last updated.
   */
  updated: RawText;

  /**
   * The title of the entry.
   */
  title: RawTextTitle;

  /**
   * The links of the entry.
   */
  link: RawEntryLink[];

  /**
   * The authors who published or updated the entry.
   */
  author: RawAuthor[];
}


export interface RawBaseSimpleFeed<T extends RawBaseEntry = RawBaseEntry> {
  /**
   * The blog id.
   */
  id: RawText;

  /**
   * RFC 3339 date-time when the blog was last updated.
   */
  updated: RawText;

  /**
   * The name of the blog, which is usually displayed in Blogger as the blog's title.
   *
   * The title can include HTML.
   */
  title: RawTextTitle;


  /**
   * The links of the blog.
   */
  link: RawLink[];

  /**
   * The author of the blog.
   */
  author: RawAuthor[];

  /**
   * The total number of blog posts.
   *
   * In a request with a query (`q` parameter), this value is usually equals to the number of posts retrieved.
   */
  openSearch$totalResults: RawText;

  /**
   * The 1-based index of the first retrieved entry.
   */
  openSearch$startIndex: RawText;

  /**
   * The maximum number of items that appear on one page.
   *
   * Commonly is the `max-results` parameter.
   */
  openSearch$itemsPerPage: RawText;

  /**
   * The retrieved entries.
   */
  entry: T[];
}

export interface RawBaseFeed<T extends RawBaseEntry = RawBaseEntry> extends RawBaseSimpleFeed<T> {
  /**
   * The subtitle of the blog, which is usually displayed in Blogger underneath the blog's title.
   *
   * The subtitle can include HTML.
   */
  subtitle: RawTextTitle;

  /**
   * Indicates whether the blog was marked as `for adults`.
   */
  blogger$adultContent: RawText;
}

export interface RawBaseEntryBlog<T extends RawBaseEntry = RawBaseEntry> {
  version: string;
  /**
   * The blog encoding.
   */
  encoding: string;

  /**
   * The entry retrieved.
   */
  entry: T;
}

export interface RawBaseBlog<F extends RawBaseSimpleFeed<any> = RawBaseSimpleFeed<any>> {

  version: string;

  /**
   * The blog encoding.
   */
  encoding: string;

  /**
   * The blog feed.
   */
  feed: F;
}

export interface RawWithContent {
  /**
   * The content of the entry. Can contain HTML markup.
   */
  content: RawTextContent;
}

export interface RawWithSummary {
  /**
   * The summary content of the entry. Can contain HTML markup.
   */
  summary: RawTextTitle;
}
