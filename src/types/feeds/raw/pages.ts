import {RawBaseBlog, RawBaseEntry, RawBaseEntryBlog, RawBaseFeed, RawWithContent, RawWithSummary,} from "./entry";

export interface RawPageEntry extends RawBaseEntry, RawWithContent {
}

export interface RawPageEntrySummary extends RawBaseEntry, RawWithSummary {
}

export interface RawPagesFeed extends RawBaseFeed<RawPageEntry> {
}

export interface RawPagesFeedSummary extends RawBaseFeed<RawPageEntrySummary> {
}

export interface RawPagesBlog extends RawBaseBlog<RawPagesFeed> {
}

export interface RawPagesBlogSummary extends RawBaseBlog<RawPagesFeedSummary> {
}

export interface RawPagesEntryBlog extends RawBaseEntryBlog<RawPageEntry> {

}

export interface RawPagesEntryBlogSummary extends RawBaseEntryBlog<RawPageEntrySummary> {
}
