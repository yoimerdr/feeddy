import {BaseBlog, BaseEntry, BaseEntryBlog, BaseFeed, WithContent, WithSummary} from "./entry";


export interface PageEntry extends BaseEntry, WithContent {
}

export interface PageEntrySummary extends BaseEntry, WithSummary {
}

export interface PagesFeed extends BaseFeed<PageEntry> {
}

export interface PagesFeedSummary extends BaseFeed<PageEntrySummary> {
}

export interface PagesBlog extends BaseBlog<PagesFeed> {}

export interface PagesBlogSummary extends BaseBlog<PagesFeedSummary> {}

export interface PagesEntryBlog extends BaseEntryBlog<PageEntry> {

}

export interface PagesEntryBlogSummary extends BaseEntryBlog<PageEntrySummary> {
}
