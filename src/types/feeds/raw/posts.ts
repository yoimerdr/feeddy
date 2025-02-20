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
};


/**
 * Represents the thumbnail of a blog post.
 */
export type RawPostThumbnail = ImageSize & {

  /**
   * The URL of the thumbnail.
   */
  url: string;
};

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

export interface RawPostEntry extends RawBasePostEntry, RawWithContent {
}

export interface RawPostEntrySummary extends RawBasePostEntry, RawWithSummary {
}

export interface RawBasePostsFeed<T extends RawBasePostEntry> extends RawBaseFeed<T> {
  /**
   * The categories with which the posts has been tagged.
   */
  category: RawCategory[];
}

export interface RawPostsFeed extends RawBasePostsFeed<RawPostEntry> {
}

export interface RawPostsFeedSummary extends RawBasePostsFeed<RawPostEntrySummary> {
}


export interface RawPostsBlog extends RawBaseBlog<RawPostsFeed> {

}

export interface RawPostsBlogSummary extends RawBaseBlog<RawPostsFeedSummary> {
}

export interface RawPostsEntryBlog extends RawBaseEntryBlog<RawPostEntry> {

}

export interface RawPostsEntryBlogSummary extends RawBaseEntryBlog<RawPostEntrySummary> {
}
