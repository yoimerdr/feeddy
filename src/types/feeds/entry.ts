import {Author} from "./author";
import {RawEntryLink, RawLink} from "./raw/entry";

export type SimpleText = string;

export interface WithContent {
  /**
   * The content of the entry. Can contain HTML markup.
   */
  content: SimpleText;
}

export interface WithSummary {
  /**
   * The summary content of the entry. Can contain HTML markup.
   */
  summary: SimpleText;
}


export interface BaseEntry {
  /**
   * The id of the entry.
   */
  id: SimpleText;

  /**
   * RFC 3339 date-time when the entry was published.
   */
  published: SimpleText;

  /**
   * RFC 3339 date-time when the entry was last updated.
   */
  updated: SimpleText;

  /**
   * The title of the entry.
   */
  title: SimpleText;

  /**
   * The links of the entry.
   */
  link: RawEntryLink[];

  /**
   * The authors who published or updated the entry.
   */
  author: Author[];
}


export interface BaseSimpleFeed<T extends BaseEntry = BaseEntry> {
  /**
   * The blog id.
   */
  id: SimpleText;

  /**
   * RFC 3339 date-time when the blog was last updated.
   */
  updated: SimpleText;

  /**
   * The name of the blog, which is usually displayed in Blogger as the blog's title.
   *
   * The title can include HTML.
   */
  title: SimpleText;


  /**
   * The links of the blog.
   */
  link: RawLink[];

  /**
   * The author of the blog.
   */
  author: Author[];

  /**
   * The total number of blog posts.
   *
   * In a request with a query (`q` parameter), this value is usually equals to the number of posts retrieved.
   */
  openSearch$totalResults: number;

  /**
   * The 1-based index of the first retrieved entry.
   */
  openSearch$startIndex: number;

  /**
   * The maximum number of items that appear on one page.
   *
   * Commonly is the `max-results` parameter.
   */
  openSearch$itemsPerPage: number;

  /**
   * The retrieved entries.
   */
  entry: T[];
}

export interface BaseFeed<T extends BaseEntry> extends BaseSimpleFeed<T> {
  /**
   * The subtitle of the blog, which is usually displayed in Blogger underneath the blog's title.
   *
   * The subtitle can include HTML.
   */
  subtitle: SimpleText;

  /**
   * Indicates whether the blog was marked as `for adults`.
   */
  blogger$adultContent: boolean;
}

export interface BaseBlog<F extends BaseSimpleFeed = BaseSimpleFeed> {

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

export interface BaseEntryBlog<T extends BaseEntry = BaseEntry> {
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
