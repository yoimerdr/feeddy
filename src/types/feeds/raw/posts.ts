import {
  RawBaseBlog,
  RawBaseEntry,
  RawBaseEntryBlog,
  RawBaseFeed,
  RawCategory,
  RawText,
  RawWithContent,
  RawWithSummary,
} from "./entry";
import {ImageSize} from "../shared";

/**
 * Represents a category of a blog entry.
 */
export interface RawPostCategory extends RawCategory {

  /**
   * The schema of the category.
   */
  schema: string;
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
 * Base interface for a post-entry in its raw form from the API.
 */
export interface RawBasePostEntry extends RawBaseEntry {
  /**
   * The thumbnail image of the post.
   */
  media$thumbnail: RawPostThumbnail;

  /**
   * The categories with which the post has been tagged.
   */
  category: RawPostCategory[];

  /**
   * The number of comments on the post.
   *
   * Note: it will only be present if the blog configuration allows comments.
   */
  thr$total?: RawText;
}

/**
 * Raw post-entry that includes the full content of the post.
 *
 * @extends {RawBasePostEntry}
 * @extends {RawWithContent}
 */
export interface RawPostEntry extends RawBasePostEntry, RawWithContent {
}

/**
 * Raw post-entry that includes only a summary of the post.
 *
 * @extends {RawBasePostEntry}
 * @extends {RawWithSummary}
 */
export interface RawPostEntrySummary extends RawBasePostEntry, RawWithSummary {
}

/**
 * Base interface for a feed containing post-entries in its raw form from the API.
 */
export interface RawBasePostsFeed<T extends RawBasePostEntry> extends RawBaseFeed<T> {
  /**
   * The categories with which the posts has been tagged.
   */
  category: RawCategory[];
}

/**
 * Raw feed containing a collection of full post-entries.
 *
 * @extends {RawBasePostsFeed<RawPostEntry>}
 */
export interface RawPostsFeed extends RawBasePostsFeed<RawPostEntry> {
}

/**
 * Raw feed containing a collection of post-summaries.
 *
 * @extends {RawBasePostsFeed<RawPostEntrySummary>}
 */
export interface RawPostsFeedSummary extends RawBasePostsFeed<RawPostEntrySummary> {
}

/**
 * Raw blog object containing a feed of full posts.
 *
 * @extends {RawBaseBlog<RawPostsFeed>}
 */
export interface RawPostsBlog extends RawBaseBlog<RawPostsFeed> {
}

/**
 * Raw blog object containing a feed of post summaries.
 *
 * @extends {RawBaseBlog<RawPostsFeedSummary>}
 */
export interface RawPostsBlogSummary extends RawBaseBlog<RawPostsFeedSummary> {
}

/**
 * Raw blog entry object containing a single full post-entry.
 *
 * @extends {RawBaseEntryBlog<RawPostEntry>}
 */
export interface RawPostsEntryBlog extends RawBaseEntryBlog<RawPostEntry> {
}

/**
 * Raw blog entry object containing a single post-entry summary.
 *
 * @extends {RawBaseEntryBlog<RawPostEntrySummary>}
 */
export interface RawPostsEntryBlogSummary extends RawBaseEntryBlog<RawPostEntrySummary> {
}
