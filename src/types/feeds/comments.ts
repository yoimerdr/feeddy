import {RawCommentReply} from "./raw/comments";
import {Entry} from "../../../lib/jstls/src/types/core";
import {BaseBlog, BaseEntry, BaseSimpleFeed, WithContent, WithSummary} from "./entry";


export interface BaseCommentEntry extends BaseEntry {
  gd$extendedProperty: Entry<string, string>[];
  "thr$in-reply-to": RawCommentReply;
}

export interface CommentEntry extends BaseCommentEntry, WithContent {
}

export interface CommentEntrySummary extends BaseCommentEntry, WithSummary {
}

export interface CommentsFeed extends BaseSimpleFeed<CommentEntry> {
}

export interface CommentsFeedSummary extends BaseSimpleFeed<CommentEntrySummary> {
}

export interface CommentsBlog extends BaseBlog<CommentsFeed> {
}

export interface CommentsBlogSummary extends BaseBlog<CommentsFeedSummary> {
}

