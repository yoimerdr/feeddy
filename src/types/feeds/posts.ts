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
   */
  thr$total?: number;
}


export interface PostEntry extends BasePostEntry, WithContent {
}

export interface PostEntrySummary extends BasePostEntry, WithSummary {
}

export interface BasePostsFeed<T extends BasePostEntry> extends BaseFeed<T> {
  /**
   * The categories with which the posts has been tagged.
   */
  category: string[];
}

export interface PostsFeed extends BasePostsFeed<PostEntry> {
}

export interface PostsFeedSummary extends BasePostsFeed<PostEntrySummary> {
}


export interface PostsBlog extends BaseBlog<PostsFeed> {

}

export interface PostsBlogSummary extends BaseBlog<PostsFeedSummary> {
}

export interface PostsEntryBlog extends BaseEntryBlog<PostEntry> {

}

export interface PostsEntryBlogSummary extends BaseEntryBlog<PostEntrySummary> {
}
