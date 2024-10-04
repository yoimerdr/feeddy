import {FeedOptionsFull, FeedOptionsSummary, ImageSize, LinkRel} from "./shared";

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
export type RawTextContent = RawText & Record<"type", "html">

/**
 * A category on blog's feed.
 */
export type RawCategory = Record<"term", string>;

/**
 * Represents a link in the blog.
 */
export type RawLink = {

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
 * Represents the image of an author in the blog.
 */
export type RawAuthorImage = ImageSize & {

  /**
   * The relationship of the image.
   */
  rel: string;

  /**
   * The URL of the image.
   */
  src: string;
}

/**
 * Represents an author in the blog.
 */
export interface RawAuthor {

  /**
   * The author's email address.
   */
  email: RawText;

  /**
   * The author's name.
   */
  name: RawText;

  /**
   * The url of the author's profile.
   */
  uri: RawText;

  /**
   * The image of the author.
   */
  gd$image: RawAuthorImage
}

/**
 * Represents a link of a blog post.
 */
export type RawPostLink = RawLink & {

  /**
   * The title of the post.
   *
   * It is only present when the post link type is `alternate`.
   */
  title?: string;
}


/**
 * Represents the thumbnail of a blog post.
 */
export type RawPostThumbnail = ImageSize & {

  /**
   * The URL of the thumbnail.
   */
  url: string;
};

/**
 * Represents a category of a blog post.
 */
export type RawPostCategory = RawCategory & {

  /**
   * The schema of the category.
   */
  schema: string;
};

export interface RawBasePost {

  /**
   * The id of the post.
   */
  id: RawText;

  /**
   * The title of the post.
   */
  title: RawTextTitle;

  /**
   * The links of the post.
   */
  link: RawPostLink[];

  /**
   * The thumbnail image of the post.
   */
  media$thumbnail: RawPostThumbnail;

  /**
   * RFC 3339 date-time when the post was last updated.
   */
  updated: RawText;

  /**
   * RFC 3339 date-time when the post was published.
   */
  published: RawText;

  /**
   * The categories with which the post has been tagged.
   */
  category: RawPostCategory[];

  /**
   * The authors who published or updated the post.
   */
  author: RawAuthor[];
}

/**
 * Represents a blog post.
 */
export interface RawPostEntry extends RawBasePost {

  /**
   * The content of the post. Can contain HTML markup.
   */
  content: RawTextContent;
}

/**
 * Represents a blog post.
 */
export interface RawPostEntrySummary extends RawBasePost {

  /**
   * The summary content of the post. Can contain HTML markup.
   */
  summary: RawTextTitle;
}

/**
 * Represents the blog feed.
 */
export interface RawBlogFeed {

  /**
   * The blog id.
   */
  id: RawText;

  /**
   * The author of the blog.
   */
  author: RawAuthor[];

  /**
   * The categories with which the posts has been tagged.
   */
  category: RawCategory[];

  /**
   * Indicates whether the blog was marked as `for adults`.
   */
  blogger$adultContent: RawText;

  /**
   * The retrieved posts.
   */
  entry: RawPostEntry[];

  /**
   * The name of the blog, which is usually displayed in Blogger as the blog's title.
   *
   * The title can include HTML.
   */
  title: RawTextTitle;

  /**
   * The subtitle of the blog, which is usually displayed in Blogger underneath the blog's title.
   *
   * The subtitle can include HTML.
   */
  subtitle: RawTextTitle;

  /**
   * RFC 3339 date-time when the blog was last updated.
   */
  updated: RawText;

  /**
   * The links of the blog.
   */
  link: RawLink[];

  /**
   * The 1-based index of the first retrieved post.
   */
  openSearch$startIndex: RawText;

  /**
   * The total number of blog posts.
   *
   * In a request with a query (`q` parameter), this value is usually equals to the number of posts retrieved.
   */
  openSearch$totalResults: RawText;

  /**
   * The maximum number of items that appear on one page.
   *
   * Commonly is the `max-results` parameter.
   */
  openSearch$itemsPerPage: RawText;
}

export type RawBlogFeedSummary = RawBlogFeed & {
  entry: RawPostEntrySummary[];
}

export type RawBlog = {

  /**
   * The blog encoding.
   */
  encoding: string;

  /**
   * The blog feed.
   */
  feed: RawBlogFeed;

  version: string;
};

export type RawBlogSummary = RawBlog & {
  feed: RawBlogFeedSummary;
}

export interface RawFeed {

  /**
   * Makes a get request to the <b>summary</b> blogger feed API using the fetch API.
   * @param options The request options.
   */
  (options: FeedOptionsSummary): Promise<RawBlogSummary>;

  /**
   * Makes a get request to the <b>default</b> blogger feed API using the fetch API.
   * @param options The request options.
   */
  (options: FeedOptionsFull): Promise<RawBlog>;

  /**
   * Makes a recursive get request to the <b>summary</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   * @see {rawGet}
   */
  all(options: FeedOptionsSummary): Promise<RawBlogSummary>;

  /**
   * Makes a recursive get request to the <b>default</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   * @see {rawGet}
   */
  all(options: FeedOptionsFull): Promise<RawBlog>;
}
