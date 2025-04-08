import {RawBaseBlog, RawBaseEntry, RawBaseEntryBlog, RawBaseFeed, RawWithContent, RawWithSummary,} from "./entry";
import {RawByIdResult} from "./index";
import {FeedRoute} from "../options";

/**
 * Raw page entry that includes the full content of the page.
 *
 * @extends {RawBaseEntry}
 * @extends {RawWithContent}
 */
export interface RawPageEntry extends RawBaseEntry, RawWithContent {
}

/**
 * Raw page entry that includes only a summary of the page.
 *
 * @extends {RawBaseEntry}
 * @extends {RawWithSummary}
 */
export interface RawPageEntrySummary extends RawBaseEntry, RawWithSummary {
}

/**
 * Raw feed containing a collection of full page entries.
 *
 * @extends {RawBaseFeed<RawPageEntry>}
 */
export interface RawPagesFeed extends RawBaseFeed<RawPageEntry> {
}

/**
 * Raw feed containing a collection of page summaries.
 *
 * @extends {RawBaseFeed<RawPageEntry>}
 */
export interface RawPagesFeedSummary extends RawBaseFeed<RawPageEntrySummary> {
}

/**
 * Raw blog object containing a feed of full pages.
 *
 * @extends {RawBaseBlog<RawPagesFeed>}
 */
export interface RawPagesBlog extends RawBaseBlog<RawPagesFeed> {
}

/**
 * Raw blog object containing a feed of page summaries.
 *
 * @extends {RawBaseBlog<RawPagesFeedSummary>}
 */
export interface RawPagesBlogSummary extends RawBaseBlog<RawPagesFeedSummary> {
}

/**
 * Raw blog entry object containing a single full page entry.
 *
 * @extends {RawBaseEntryBlog<RawPageEntry>}
 */
export interface RawPagesEntryBlog extends RawBaseEntryBlog<RawPageEntry> {

}

/**
 * Raw blog entry object containing a single page entry summary.
 *
 * @extends {RawBaseEntryBlog<RawPageEntrySummary>}
 */
export interface RawPagesEntryBlogSummary extends RawBaseEntryBlog<RawPageEntrySummary> {
}

export type RawByIdPageResult<R extends FeedRoute = FeedRoute> = RawByIdResult<"posts", R>;

export type RawByIdPageResultSummary = RawByIdPageResult<"summary">;
