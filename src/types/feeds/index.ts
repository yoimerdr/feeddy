import {RawAuthorImage, RawFeed, RawLink, RawPostLink} from "./raw";
import {FeedOptionsFull, FeedOptionsSummary, ImageSize} from "./shared";

export type Text = string;

export interface Author {

  /**
   * The author's email address.
   */
  email: Text;

  /**
   * The author's name.
   */
  name: Text;

  /**
   * The author's profile url.
   */
  uri: Text;

  /**
   * The image of the author.
   */
  gd$image: RawAuthorImage;
}

/**
 * Represents the thumbnail of a blog post.
 */
export type PostThumbnail = {

  /**
   * The image's url.
   */
  url: string;
} & ImageSize<number>;

export type BasePost = {
  /**
   * The authors who published or updated the post.
   */
  author: Author[];

  /**
   * The id of the post.
   */
  id: Text;

  /**
   * The title of the post.
   */
  title: Text;

  /**
   * The links of the post.
   */
  link: RawPostLink[];

  /**
   * The categories with which the post has been tagged.
   */
  category: string[];

  /**
   * The thumbnail image of the post.
   */
  media$thumbnail: PostThumbnail;

  /**
   * RFC 3339 date-time when this post was last updated.
   */
  updated: Text;

  /**
   * RFC 3339 date-time when this post was published.
   */
  published: Text;
}

/**
 * Represents a blog post.
 */
export type PostEntry = BasePost & {
  /**
   * The content of the post. Can contain HTML markup.
   */
  content: Text
}

/**
 * Represents a blog post.
 */
export type PostEntrySummary = BasePost & {
  /**
   * The summary content of the post. Can contain HTML markup.
   */
  summary: Text
}

/**
 * Represents the blog feed.
 */
export type BlogFeed = {

  /**
   * The author of the blog.
   */
  author: Author[];

  /**
   * The blog id.
   */
  id: Text;

  /**
   * The categories with which the posts has been tagged.
   */
  category: string[];

  /**
   * Indicates whether the blog was marked as `for adults`.
   */
  blogger$adultContent: boolean;

  /**
   * The name of the blog, which is usually displayed in Blogger as the blog's title.
   *
   * The title can include HTML.
   */
  title: Text;

  /**
   * The subtitle of the blog, which is usually displayed in Blogger underneath the blog's title.
   *
   * The subtitle can include HTML.
   */
  subtitle: Text;

  /**
   * The links of the blog.
   */
  link: RawLink[];

  /**
   * RFC 3339 date-time when the blog was last updated.
   */
  updated: Text;

  /**
   * The 1-based index of the first retrieved post.
   */
  openSearch$startIndex: number;

  /**
   * The total number of blog posts.
   *
   * In a request with a query (`q` parameter), this value is usually equals to the number of posts retrieved.
   */
  openSearch$totalResults: number;

  /**
   * The maximum number of items that appear on one page.
   *
   * Commonly is the `max-results` parameter.
   */
  openSearch$itemsPerPage: number;

  /**
   * The retrieved posts.
   */
  entry: PostEntry[]
}

export type BlogFeedSummary = BlogFeed & {
  entry: PostEntrySummary[]
}

export type Blog = {
  /**
   * The blog encoding.
   */
  encoding: string;

  version: string;

  /**
   * The blog feed.
   */
  feed: BlogFeed;
}

export type BlogSummary = Blog & {
  feed: BlogFeedSummary
}

export interface Feed {
  /**
   * Makes a get request to the <b>summary</b> blogger feed API using the fetch API.
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * @param options The request options.
   */
  (options: FeedOptionsSummary): Promise<BlogSummary>;

  /**
   * Makes a get request to the <b>default</b> blogger feed API using the fetch API.
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * @param options The request options.
   */
  (options: FeedOptionsFull): Promise<Blog>;

  /**
   * Makes a recursive get request to the <b>summary</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   */
  all(options: FeedOptionsSummary): Promise<BlogSummary>;

  /**
   * Makes a recursive get request to the <b>default</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   */
  all(options: FeedOptionsFull): Promise<Blog>;

  /**
   * The handler to make requests to the blogger feed API directly.
   */
  readonly raw: RawFeed
}
