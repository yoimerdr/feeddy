import {ImageSize} from "./shared";
import {BaseBlog, BaseEntry, BaseEntryBlog, BaseFeed, WithContent, WithSummary} from "./entry";

/**
 * Represents the thumbnail of a blog post.
 */
export type PostThumbnail = ImageSize<number> & {

  /**
   * The URL of the thumbnail.
   */
  url: string;
};

/**
 * Base interface for a post-entry in its mapped form.
 */
export interface BasePostEntry extends BaseEntry {
  /**
   * The thumbnail image of the post.
   */
  media$thumbnail: PostThumbnail;

  /**
   * The categories with which the post has been tagged.
   */
  category: string[];

  /**
   * The number of comments on the post.
   *
   * Note: it will only be present if the blog configuration allows comments.
   * @since 1.2
   */
  thr$total?: number;
}

/**
 * Post-entry that includes the full content of the post.
 *
 * @extends {BasePostEntry}
 * @extends {WithContent}
 */
export interface PostEntry extends BasePostEntry, WithContent {
}

/**
 * Post-entry that includes only a summary of the post.
 *
 * @extends {BasePostEntry}
 * @extends {WithSummary}
 */
export interface PostEntrySummary extends BasePostEntry, WithSummary {
}

/**
 * Base interface for a feed containing post-entries in its mapped form from the API.
 */
export interface BasePostsFeed<T extends BasePostEntry> extends BaseFeed<T> {
  /**
   * The categories with which the posts has been tagged.
   */
  category: string[];
}

/**
 * Feed containing a collection of full post-entries.
 *
 * @extends {BasePostsFeed<PostEntry>}
 */
export interface PostsFeed extends BasePostsFeed<PostEntry> {
}

/**
 * Feed containing a collection of post-summaries.
 *
 * @extends {BasePostsFeed<PostEntrySummary>}
 */
export interface PostsFeedSummary extends BasePostsFeed<PostEntrySummary> {
}

/**
 * Blog object containing a feed of full posts.
 *
 * @extends {BaseBlog<PostsFeed>}
 */
export interface PostsBlog extends BaseBlog<PostsFeed> {
}

/**
 * Blog object containing a feed of post summaries.
 *
 * @extends {BaseBlog<PostsFeedSummary>}
 */
export interface PostsBlogSummary extends BaseBlog<PostsFeedSummary> {
}

/**
 * Blog entry object containing a single full post-entry.
 *
 * @extends {BaseEntryBlog<PostEntry>}
 */
export interface PostsEntryBlog extends BaseEntryBlog<PostEntry> {
}

/**
 * Blog entry object containing a single post-entry summary.
 *
 * @extends {BaseEntryBlog<PostEntrySummary>}
 */
export interface PostsEntryBlogSummary extends BaseEntryBlog<PostEntrySummary> {
}
