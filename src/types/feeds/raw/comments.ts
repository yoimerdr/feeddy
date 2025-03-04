import {RawBaseBlog, RawBaseEntry, RawBaseSimpleFeed, RawSourceLink, RawWithContent, RawWithSummary} from "./entry";
import {Entry} from "../../../../lib/jstls/src/types/core";

/**
 * Represents a link to the comment being replied to.
 */
export interface RawCommentReply extends RawSourceLink {
  /**
   * The XML namespace for the Threading Extensions specification.
   * Used to define the threading relationship between comments.
   */
  xmlns$thr: string;
}

/**
 * Base interface for a comment entry in its raw form from the API.
 */
export interface RawBaseCommentEntry extends RawBaseEntry {
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
 * Raw comment entry that includes the full content of the comment.
 *
 * @extends {RawBaseCommentEntry}
 * @extends {RawWithContent}
 */
export interface RawCommentEntry extends RawBaseCommentEntry, RawWithContent {
}

/**
 * Raw comment entry that includes only a summary of the comment.
 *
 * @extends {RawBaseCommentEntry}
 * @extends {RawWithSummary}
 */
export interface RawCommentEntrySummary extends RawBaseCommentEntry, RawWithSummary {
}

/**
 * Raw feed containing a collection of full comment entries.
 *
 * @extends {RawBaseSimpleFeed<RawCommentEntry>}
 */
export interface RawCommentsFeed extends RawBaseSimpleFeed<RawCommentEntry> {
}

/**
 * Raw feed containing a collection of comment summaries.
 *
 * @extends {RawBaseSimpleFeed<RawCommentEntrySummary>}
 */
export interface RawCommentsFeedSummary extends RawBaseSimpleFeed<RawCommentEntrySummary> {
}

/**
 * Raw blog object containing a feed of full comments.
 *
 * @extends {RawBaseBlog<RawCommentsFeed>}
 */
export interface RawCommentsBlog extends RawBaseBlog<RawCommentsFeed> {
}

/**
 * Raw blog object containing a feed of comment summaries.
 *
 * @extends {RawBaseBlog<RawCommentsFeedSummary>}
 */
export interface RawCommentsBlogSummary extends RawBaseBlog<RawCommentsFeedSummary> {
}
