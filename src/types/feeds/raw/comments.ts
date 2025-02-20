import {RawBaseBlog, RawBaseEntry, RawBaseSimpleFeed, RawSourceLink, RawWithContent, RawWithSummary} from "./entry";
import {Entry} from "../../../../lib/jstls/src/types/core";

export interface RawCommentReply extends RawSourceLink {
  xmlns$thr: string;
}

export interface RawBaseCommentEntry extends RawBaseEntry {
  gd$extendedProperty: Entry<string, string>[];
  "thr$in-reply-to": RawCommentReply;
}

export interface RawCommentEntry extends RawBaseCommentEntry, RawWithContent {
}

export interface RawCommentEntrySummary extends RawBaseCommentEntry, RawWithSummary {
}

export interface RawCommentsFeed extends RawBaseSimpleFeed<RawCommentEntry> {
}

export interface RawCommentsFeedSummary extends RawBaseSimpleFeed<RawCommentEntrySummary> {
}

export interface RawCommentsBlog extends RawBaseBlog<RawCommentsFeed> {
}

export interface RawCommentsBlogSummary extends RawBaseBlog<RawCommentsFeedSummary> {
}

