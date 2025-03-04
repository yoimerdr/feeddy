import {BaseBlog, BaseEntry, BaseEntryBlog, BaseFeed, WithContent, WithSummary} from "./entry";

/**
 * Page entry that includes the full content of the page.
 *
 * @extends {BaseEntry}
 * @extends {WithContent}
 */
export interface PageEntry extends BaseEntry, WithContent {
}

/**
 * Page entry that includes only a summary of the page.
 *
 * @extends {BaseEntry}
 * @extends {WithSummary}
 */
export interface PageEntrySummary extends BaseEntry, WithSummary {
}

/**
 * Feed containing a collection of full page entries.
 *
 * @extends {BaseFeed<PageEntry>}
 */
export interface PagesFeed extends BaseFeed<PageEntry> {
}

/**
 * Feed containing a collection of page summaries.
 *
 * @extends {BaseFeed<PageEntry>}
 */
export interface PagesFeedSummary extends BaseFeed<PageEntrySummary> {
}

/**
 * Blog object containing a feed of full pages.
 *
 * @extends {BaseBlog<PagesFeed>}
 */
export interface PagesBlog extends BaseBlog<PagesFeed> {
}

/**
 * Blog object containing a feed of page summaries.
 *
 * @extends {BaseBlog<PagesFeedSummary>}
 */
export interface PagesBlogSummary extends BaseBlog<PagesFeedSummary> {
}

/**
 * Blog entry object containing a single full page entry.
 *
 * @extends {BaseEntryBlog<PageEntry>}
 */
export interface PagesEntryBlog extends BaseEntryBlog<PageEntry> {

}

/**
 * Blog entry object containing a single page entry summary.
 *
 * @extends {BaseEntryBlog<PageEntrySummary>}
 */
export interface PagesEntryBlogSummary extends BaseEntryBlog<PageEntrySummary> {
}
