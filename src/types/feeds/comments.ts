import {RawCommentReply} from "./raw/comments";
import {Entry} from "../../../lib/jstls/src/types/core";
import {BaseBlog, BaseEntry, BaseSimpleFeed, WithContent, WithSummary} from "./entry";

/**
 * Base interface for a comment entry in its mapped form.
 */
export interface BaseCommentEntry extends BaseEntry {
  /**
   * Extended properties attached to the comment, containing key-value pairs that can contain additional metadata or settings.
   *
   * The exact usage and valid properties are determined by the API.
   */
  gd$extendedProperty: Entry<string, string>[];

  /**
   * Reference to the parent resource this comment is replying to.
   * Could be either a blog entry or another comment in a thread.
   */
  "thr$in-reply-to": RawCommentReply;
}

/**
 * Comment entry that includes the full content of the comment.
 *
 * @extends {BaseCommentEntry}
 * @extends {WithContent}
 */
export interface CommentEntry extends BaseCommentEntry, WithContent {
}

/**
 * Comment entry that includes only a summary of the comment.
 *
 * @extends {BaseCommentEntry}
 * @extends {WithSummary}
 */
export interface CommentEntrySummary extends BaseCommentEntry, WithSummary {
}

/**
 * Feed containing a collection of full comment entries.
 *
 * @extends {BaseSimpleFeed<CommentEntry>}
 */
export interface CommentsFeed extends BaseSimpleFeed<CommentEntry> {
}

/**
 * Feed containing a collection of comment summaries.
 *
 * @extends {BaseSimpleFeed<CommentEntrySummary>}
 */
export interface CommentsFeedSummary extends BaseSimpleFeed<CommentEntrySummary> {
}

/**
 * Blog object containing a feed of full comments.
 *
 * @extends {BaseBlog<CommentsFeed>}
 */
export interface CommentsBlog extends BaseBlog<CommentsFeed> {
}

/**
 * Blog object containing a feed of comment summaries.
 *
 * @extends {BaseBlog<CommentsFeedSummary>}
 */
export interface CommentsBlogSummary extends BaseBlog<CommentsFeedSummary> {
}

