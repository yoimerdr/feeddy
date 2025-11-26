/**
 * The order by options for the feed request.
 */
type OrderBy = "updated" | "published";
/**
 * The alternative representation type options.
 */
type Alt = "json" | "rss" | "atom";

interface RequestFeedParams {
  /**
   * The maximum number of results to be retrieved.
   */
  "max-results": string | number;
  /**
   * The 1-based index of the first result to be retrieved.
   */
  "start-index": string | number;
  /**
   * The inclusive min bound on the entry publication date.
   */
  "published-min": string;
  /**
   * The exclusive max bound on the entry publication date.
   */
  "published-max": string;
  /**
   * The inclusive min bound on the entry update date.
   */
  "updated-min": string;
  /**
   * The exclusive min bound on the entry update date.
   */
  "updated-max": string;
  /**
   * The sort order applied to results.
   */
  orderby: OrderBy;
  /**
   * The full-text query string.
   */
  q: string;
  /**
   * The alternative representation type.
   */
  alt: Alt;
}

interface WithId {
  /**
   * The entry id.
   */
  id: string;
}

/**
 * The route options of the blog's feed.
 */
type FeedRoute = 'summary' | "full";
/**
 * The type options of the blog's feed.
 */
type FeedType = "posts" | "comments" | "pages";

interface BaseFeedOptions<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> {
  /**
   * The blog's URL.
   */
  blogUrl?: string;
  /**
   * The route of the blog's feed.
   *
   * The possible values are 'full' or 'summary'.
   */
  route: R;
  /**
   * The type of the blog's feed.
   *
   * The possible values are "posts" or "comments" or "pages".
   */
  type: T;
  /**
   * The parameters for the feed request.
   */
  params?: Partial<RequestFeedParams>;
}

/**
 * The options for configuring a blog feed request.
 * @template T - The type of feed (posts, comments, or pages)
 * @template R - The route type (summary or full)
 */
type FeedOptions<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> = BaseFeedOptions<T, R>;
/**
 * The options for configuring a summary blog feed request.
 * @template T - The type of feed (posts, comments, or pages)
 */
type FeedOptionsSummary<T extends FeedType = FeedType> = Omit<FeedOptions<T, "summary">, "route">;

/**
 * Base interface for options that contain feed configuration.
 * @template F - The type of feed options, defaults to BaseFeedOptions
 */
interface InnerFeedOptions<F = BaseFeedOptions> {
  /**
   * The blog's feed options.
   */
  feed: F;
}

/**
 * The options for configuring a blog feed request by ID.
 * @template T - The type of feed (posts, comments, or pages)
 * @template R - The route type (summary or full)
 */
interface FeedByIdOptions<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> extends InnerFeedOptions<FeedOptions<T, R>>, WithId {
}

/**
 * The options for configuring a summary blog feed request by ID.
 * @template T - The type of feed (posts, comments, or pages)
 */
interface FeedByIdOptionsSummary<T extends FeedType = FeedType> extends InnerFeedOptions<FeedOptionsSummary<T>>, WithId {
}

/**
 * Determines what result will be obtained according to the route and type of feed.
 */
type FeedResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute, SP = never, SC = never, SPP = never, FP = never, FC = never, FPP = never> = R extends "summary" ? (T extends "posts" ? SP : T extends "comments" ? SC : T extends "pages" ? SPP : never) : R extends "full" ? (T extends "posts" ? FP : T extends "comments" ? FC : T extends "pages" ? FPP : never) : never;

/**
 * Extracts the keys of T
 */
type Keys<T, P extends PropertyKey = PropertyKey> = Extract<keyof T, P>;
type Nullables = undefined | null;
/**
 * Refers to a null or undefined type T.
 */
type Maybe<Ty> = Ty | Nullables;
/**
 * Refers to a null or undefined type string.
 */
type MaybeString = Maybe<string>;

interface EntryLike<T = any> {
  value: T;
}

interface Entry<V = any, K = PropertyKey> extends EntryLike<V> {
  key: K;
}

type ImageSize<U = string> = {
  /**
   * Width dimension.
   */
  width: U;
  /**
   * Height dimension.
   */
  height: U;
};
/**
 * The relationship of a link.
 */
type LinkRel = 'alternate' | 'next' | 'hub' | 'self' | 'edit' | 'replies' | 'http://schemas.google.com/g/2005#feed';

interface Routes {
  /**
   * The default feed posts route.
   */
  readonly posts: string;
  /**
   * The summary feed posts route.
   */
  readonly postsSummary: string;
  /**
   * The default feed comments route.
   */
  readonly comments: string;
  /**
   * The summary feed comments route.
   */
  readonly commentsSummary: string;
  /**
   * The default feed pages route.
   */
  readonly pages: string;
  /**
   * The summary feed pages route.
   */
  readonly pagesSummary: string;
}

/**
 * Represents an author in the blog.
 */
interface RawAuthor {
  /**
   * The author's email address.
   */
  email: RawText;
  /**
   * The author's name.
   */
  name: RawText;
  /**
   * The url of the author's profile.
   */
  uri: RawText;
  /**
   * The image of the author.
   */
  gd$image: RawAuthorImage;
}

/**
 * Represents the image of an author in the blog.
 */
type RawAuthorImage = ImageSize & {
  /**
   * The relationship of the image.
   */
  rel: string;
  /**
   * The URL of the image.
   */
  src: string;
};

/**
 * A string on blog's feed.
 */
type RawText = Record<"$t", string>;
/**
 * A title on blog's feed.
 */
type RawTextTitle = RawText & Record<"type", "text">;
/**
 * A content on blog's feed.
 */
type RawTextContent = RawText & Record<"type", "html">;
/**
 * A category on blog's feed.
 */
type RawCategory = Record<"term", string>;

/**
 * Represents a link in the blog.
 */
interface RawLink {
  /**
   * The relationship of the link.
   */
  rel: LinkRel;
  /**
   * The URL of the link.
   */
  href: string;
  /**
   * The MIME type of the linked resource.
   */
  type?: string;
}

/**
 * Represents a link of a blog entry.
 */
interface RawEntryLink extends RawLink {
  /**
   * The title of the entry.
   */
  title?: string;
}

interface RawSourceLink extends RawLink {
  /**
   * The link to the resource it belongs to.
   */
  source: string;
}

interface RawBaseEntry {
  /**
   * The id of the entry.
   */
  id: RawText;
  /**
   * RFC 3339 date-time when the entry was published.
   */
  published: RawText;
  /**
   * RFC 3339 date-time when the entry was last updated.
   */
  updated: RawText;
  /**
   * The title of the entry.
   */
  title: RawTextTitle;
  /**
   * The links of the entry.
   */
  link: RawEntryLink[];
  /**
   * The authors who published or updated the entry.
   */
  author: RawAuthor[];
}

interface RawBaseSimpleFeed<T extends RawBaseEntry = RawBaseEntry> {
  /**
   * The blog id.
   */
  id: RawText;
  /**
   * RFC 3339 date-time when the blog was last updated.
   */
  updated: RawText;
  /**
   * The name of the feed. Can include HTML markup.
   */
  title: RawTextTitle;
  /**
   * The links of the blog.
   */
  link: RawLink[];
  /**
   * The author of the blog.
   */
  author: RawAuthor[];
  /**
   * The total number of entries.
   *
   * In a request with a query (`q` parameter), this value is usually equals to the number of entries retrieved.
   */
  openSearch$totalResults: RawText;
  /**
   * The 1-based index of the first retrieved entry.
   */
  openSearch$startIndex: RawText;
  /**
   * The maximum number of items that appear on one page.
   *
   * Commonly is the `max-results` parameter.
   */
  openSearch$itemsPerPage: RawText;
  /**
   * The retrieved entries.
   */
  entry: T[];
}

interface RawBaseFeed<T extends RawBaseEntry = RawBaseEntry> extends RawBaseSimpleFeed<T> {
  /**
   * The subtitle or description of the feed. Can contain HTML markup.
   */
  subtitle: RawTextTitle;
  /**
   * A flag indicating whether the blog contains adult content.
   */
  blogger$adultContent: RawText;
}

interface RawBaseEntryBlog<T extends RawBaseEntry = RawBaseEntry> {
  version: string;
  /**
   * The blog encoding.
   */
  encoding: string;
  /**
   * The entry retrieved.
   */
  entry: T;
}

interface RawBaseBlog<F extends RawBaseSimpleFeed<any> = RawBaseSimpleFeed<any>> {
  version: string;
  /**
   * The blog encoding.
   */
  encoding: string;
  /**
   * The blog feed.
   */
  feed: F;
}

interface RawWithContent {
  /**
   * The content of the entry. Can contain HTML markup.
   */
  content: RawTextContent;
}

interface RawWithSummary {
  /**
   * The summary content of the entry. Can contain HTML markup.
   */
  summary: RawTextTitle;
}

/**
 * Builds a request URL for the blog feed API based on provided options.
 *
 * @param options - Configuration options for the request
 * @param id - Optional ID of a specific entry to fetch.
 * @returns Constructed URL object with appropriate path and query parameters
 * @throws {IllegalArgumentError} If options object is invalid or blog URL cannot be determined
 * @remarks The id parameter is supported since 1.2
 */
declare function buildUrl(options: Partial<BaseFeedOptions>, id?: string): URL;

/**
 * Extracts the numeric ID from a blog entry identifier string or object.
 *
 * @param source - The source containing the ID.
 * @param type - The type of entry ID to extract (blog, post, page).
 * @returns The extracted numeric ID as a string
 * @throws {IllegalArgumentError} If type is invalid or ID cannot be extracted
 * @since 1.2
 */
declare function getId(source: string | RawText | Record<"id", RawText | string>, type: "blog" | "post" | "page"): string;

/**
 * Represents a category of a blog entry.
 */
interface RawPostCategory extends RawCategory {
  /**
   * The schema of the category.
   */
  schema: string;
}

/**
 * Represents the thumbnail of a blog post.
 */
type RawPostThumbnail = ImageSize & {
  /**
   * The URL of the thumbnail.
   */
  url: string;
};

/**
 * Base interface for a post-entry in its raw form from the API.
 */
interface RawBasePostEntry extends RawBaseEntry {
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

/**
 * Raw post-entry that includes the full content of the post.
 *
 * @extends {RawBasePostEntry}
 * @extends {RawWithContent}
 */
interface RawPostEntry extends RawBasePostEntry, RawWithContent {
}

/**
 * Raw post-entry that includes only a summary of the post.
 *
 * @extends {RawBasePostEntry}
 * @extends {RawWithSummary}
 */
interface RawPostEntrySummary extends RawBasePostEntry, RawWithSummary {
}

/**
 * Base interface for a feed containing post-entries in its raw form from the API.
 */
interface RawBasePostsFeed<T extends RawBasePostEntry> extends RawBaseFeed<T> {
  /**
   * The categories with which the posts has been tagged.
   */
  category: RawCategory[];
}

/**
 * Raw feed containing a collection of full post-entries.
 *
 * @extends {RawBasePostsFeed<RawPostEntry>}
 */
interface RawPostsFeed extends RawBasePostsFeed<RawPostEntry> {
}

/**
 * Raw feed containing a collection of post-summaries.
 *
 * @extends {RawBasePostsFeed<RawPostEntrySummary>}
 */
interface RawPostsFeedSummary extends RawBasePostsFeed<RawPostEntrySummary> {
}

/**
 * Raw blog object containing a feed of full posts.
 *
 * @extends {RawBaseBlog<RawPostsFeed>}
 */
interface RawPostsBlog extends RawBaseBlog<RawPostsFeed> {
}

/**
 * Raw blog object containing a feed of post summaries.
 *
 * @extends {RawBaseBlog<RawPostsFeedSummary>}
 */
interface RawPostsBlogSummary extends RawBaseBlog<RawPostsFeedSummary> {
}

/**
 * Raw blog entry object containing a single full post-entry.
 *
 * @extends {RawBaseEntryBlog<RawPostEntry>}
 */
interface RawPostsEntryBlog extends RawBaseEntryBlog<RawPostEntry> {
}

/**
 * Raw blog entry object containing a single post-entry summary.
 *
 * @extends {RawBaseEntryBlog<RawPostEntrySummary>}
 */
interface RawPostsEntryBlogSummary extends RawBaseEntryBlog<RawPostEntrySummary> {
}

type RawPostsResult<R extends FeedRoute = FeedRoute> = RawResult<"posts", R>;
type RawPostsResultSummary = RawPostsResult<"summary">;
type RawByIdPostResult<R extends FeedRoute = FeedRoute> = RawByIdResult<"posts", R>;
type RawByIdPostResultSummary = RawByIdPostResult<"summary">;

/**
 * Represents a link to the comment being replied to.
 */
interface RawCommentReply extends RawSourceLink {
  /**
   * The XML namespace for the Threading Extensions specification.
   * Used to define the threading relationship between comments.
   */
  xmlns$thr: string;
}

/**
 * Base interface for a comment entry in its raw form from the API.
 */
interface RawBaseCommentEntry extends RawBaseEntry {
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
interface RawCommentEntry extends RawBaseCommentEntry, RawWithContent {
}

/**
 * Raw comment entry that includes only a summary of the comment.
 *
 * @extends {RawBaseCommentEntry}
 * @extends {RawWithSummary}
 */
interface RawCommentEntrySummary extends RawBaseCommentEntry, RawWithSummary {
}

/**
 * Raw feed containing a collection of full comment entries.
 *
 * @extends {RawBaseSimpleFeed<RawCommentEntry>}
 */
interface RawCommentsFeed extends RawBaseSimpleFeed<RawCommentEntry> {
}

/**
 * Raw feed containing a collection of comment summaries.
 *
 * @extends {RawBaseSimpleFeed<RawCommentEntrySummary>}
 */
interface RawCommentsFeedSummary extends RawBaseSimpleFeed<RawCommentEntrySummary> {
}

/**
 * Raw blog object containing a feed of full comments.
 *
 * @extends {RawBaseBlog<RawCommentsFeed>}
 */
interface RawCommentsBlog extends RawBaseBlog<RawCommentsFeed> {
}

/**
 * Raw blog object containing a feed of comment summaries.
 *
 * @extends {RawBaseBlog<RawCommentsFeedSummary>}
 */
interface RawCommentsBlogSummary extends RawBaseBlog<RawCommentsFeedSummary> {
}

/**
 * Raw page entry that includes the full content of the page.
 *
 * @extends {RawBaseEntry}
 * @extends {RawWithContent}
 */
interface RawPageEntry extends RawBaseEntry, RawWithContent {
}

/**
 * Raw page entry that includes only a summary of the page.
 *
 * @extends {RawBaseEntry}
 * @extends {RawWithSummary}
 */
interface RawPageEntrySummary extends RawBaseEntry, RawWithSummary {
}

/**
 * Raw feed containing a collection of full page entries.
 *
 * @extends {RawBaseFeed<RawPageEntry>}
 */
interface RawPagesFeed extends RawBaseFeed<RawPageEntry> {
}

/**
 * Raw feed containing a collection of page summaries.
 *
 * @extends {RawBaseFeed<RawPageEntry>}
 */
interface RawPagesFeedSummary extends RawBaseFeed<RawPageEntrySummary> {
}

/**
 * Raw blog object containing a feed of full pages.
 *
 * @extends {RawBaseBlog<RawPagesFeed>}
 */
interface RawPagesBlog extends RawBaseBlog<RawPagesFeed> {
}

/**
 * Raw blog object containing a feed of page summaries.
 *
 * @extends {RawBaseBlog<RawPagesFeedSummary>}
 */
interface RawPagesBlogSummary extends RawBaseBlog<RawPagesFeedSummary> {
}

/**
 * Raw blog entry object containing a single full page entry.
 *
 * @extends {RawBaseEntryBlog<RawPageEntry>}
 */
interface RawPagesEntryBlog extends RawBaseEntryBlog<RawPageEntry> {
}

/**
 * Raw blog entry object containing a single page entry summary.
 *
 * @extends {RawBaseEntryBlog<RawPageEntrySummary>}
 */
interface RawPagesEntryBlogSummary extends RawBaseEntryBlog<RawPageEntrySummary> {
}

/**
 * Represents an author in the blog.
 */
interface Author {
  /**
   * The author's email address.
   */
  email: SimpleText;
  /**
   * The author's name.
   */
  name: SimpleText;
  /**
   * The url of the author's profile.
   */
  uri: SimpleText;
  /**
   * The image of the author.
   */
  gd$image: RawAuthorImage;
}

type SimpleText = string;

interface WithContent {
  /**
   * The content of the entry. Can contain HTML markup.
   */
  content: SimpleText;
}

interface WithSummary {
  /**
   * The summary content of the entry. Can contain HTML markup.
   */
  summary: SimpleText;
}

interface BaseEntry {
  /**
   * The id of the entry.
   */
  id: SimpleText;
  /**
   * RFC 3339 date-time when the entry was published.
   */
  published: SimpleText;
  /**
   * RFC 3339 date-time when the entry was last updated.
   */
  updated: SimpleText;
  /**
   * The title of the entry.
   */
  title: SimpleText;
  /**
   * The links of the entry.
   */
  link: RawEntryLink[];
  /**
   * The authors who published or updated the entry.
   */
  author: Author[];
}

interface BaseSimpleFeed<T extends BaseEntry = BaseEntry> {
  /**
   * The blog id.
   */
  id: SimpleText;
  /**
   * RFC 3339 date-time when the blog was last updated.
   */
  updated: SimpleText;
  /**
   * The name of the feed. Can include HTML markup.
   */
  title: SimpleText;
  /**
   * The links of the blog.
   */
  link: RawLink[];
  /**
   * The author of the blog.
   */
  author: Author[];
  /**
   * The total number of entries.
   *
   * In a request with a query (`q` parameter), this value is usually equals to the number of entries retrieved.
   */
  openSearch$totalResults: number;
  /**
   * The 1-based index of the first retrieved entry.
   */
  openSearch$startIndex: number;
  /**
   * The maximum number of items that appear on one page.
   *
   * Commonly is the `max-results` parameter.
   */
  openSearch$itemsPerPage: number;
  /**
   * The retrieved entries.
   */
  entry: T[];
}

interface BaseFeed<T extends BaseEntry> extends BaseSimpleFeed<T> {
  /**
   * The subtitle or description of the feed.
   *
   * Can contain HTML markup.
   */
  subtitle: SimpleText;
  /**
   * A flag indicating whether the blog contains adult content.
   */
  blogger$adultContent: boolean;
}

interface BaseBlog<F extends BaseSimpleFeed = BaseSimpleFeed> {
  version: string;
  /**
   * The blog encoding.
   */
  encoding: string;
  /**
   * The blog feed.
   */
  feed: F;
}

interface BaseEntryBlog<T extends BaseEntry = BaseEntry> {
  version: string;
  /**
   * The blog encoding.
   */
  encoding: string;
  /**
   * The entry retrieved.
   */
  entry: T;
}

/**
 * Represents the thumbnail of a blog post.
 */
type PostThumbnail = ImageSize<number> & {
  /**
   * The URL of the thumbnail.
   */
  url: string;
};

/**
 * Base interface for a post-entry in its mapped form.
 */
interface BasePostEntry extends BaseEntry {
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
   * @since 1.2
   */
  thr$total?: number;
}

/**
 * Post-entry that includes the full content of the post.
 *
 * @extends {BasePostEntry}
 * @extends {WithContent}
 */
interface PostEntry extends BasePostEntry, WithContent {
}

/**
 * Post-entry that includes only a summary of the post.
 *
 * @extends {BasePostEntry}
 * @extends {WithSummary}
 */
interface PostEntrySummary extends BasePostEntry, WithSummary {
}

/**
 * Base interface for a feed containing post-entries in its mapped form from the API.
 */
interface BasePostsFeed<T extends BasePostEntry> extends BaseFeed<T> {
  /**
   * The categories with which the posts has been tagged.
   */
  category: string[];
}

/**
 * Feed containing a collection of full post-entries.
 *
 * @extends {BasePostsFeed<PostEntry>}
 */
interface PostsFeed extends BasePostsFeed<PostEntry> {
}

/**
 * Feed containing a collection of post-summaries.
 *
 * @extends {BasePostsFeed<PostEntrySummary>}
 */
interface PostsFeedSummary extends BasePostsFeed<PostEntrySummary> {
}

/**
 * Blog object containing a feed of full posts.
 *
 * @extends {BaseBlog<PostsFeed>}
 */
interface PostsBlog extends BaseBlog<PostsFeed> {
}

/**
 * Blog object containing a feed of post summaries.
 *
 * @extends {BaseBlog<PostsFeedSummary>}
 */
interface PostsBlogSummary extends BaseBlog<PostsFeedSummary> {
}

/**
 * Blog entry object containing a single full post-entry.
 *
 * @extends {BaseEntryBlog<PostEntry>}
 */
interface PostsEntryBlog extends BaseEntryBlog<PostEntry> {
}

/**
 * Blog entry object containing a single post-entry summary.
 *
 * @extends {BaseEntryBlog<PostEntrySummary>}
 */
interface PostsEntryBlogSummary extends BaseEntryBlog<PostEntrySummary> {
}

/**
 * Base interface for a comment entry in its mapped form.
 */
interface BaseCommentEntry extends BaseEntry {
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
interface CommentEntry extends BaseCommentEntry, WithContent {
}

/**
 * Comment entry that includes only a summary of the comment.
 *
 * @extends {BaseCommentEntry}
 * @extends {WithSummary}
 */
interface CommentEntrySummary extends BaseCommentEntry, WithSummary {
}

/**
 * Feed containing a collection of full comment entries.
 *
 * @extends {BaseSimpleFeed<CommentEntry>}
 */
interface CommentsFeed extends BaseSimpleFeed<CommentEntry> {
}

/**
 * Feed containing a collection of comment summaries.
 *
 * @extends {BaseSimpleFeed<CommentEntrySummary>}
 */
interface CommentsFeedSummary extends BaseSimpleFeed<CommentEntrySummary> {
}

/**
 * Blog object containing a feed of full comments.
 *
 * @extends {BaseBlog<CommentsFeed>}
 */
interface CommentsBlog extends BaseBlog<CommentsFeed> {
}

/**
 * Blog object containing a feed of comment summaries.
 *
 * @extends {BaseBlog<CommentsFeedSummary>}
 */
interface CommentsBlogSummary extends BaseBlog<CommentsFeedSummary> {
}

/**
 * Page entry that includes the full content of the page.
 *
 * @extends {BaseEntry}
 * @extends {WithContent}
 */
interface PageEntry extends BaseEntry, WithContent {
}

/**
 * Page entry that includes only a summary of the page.
 *
 * @extends {BaseEntry}
 * @extends {WithSummary}
 */
interface PageEntrySummary extends BaseEntry, WithSummary {
}

/**
 * Feed containing a collection of full page entries.
 *
 * @extends {BaseFeed<PageEntry>}
 */
interface PagesFeed extends BaseFeed<PageEntry> {
}

/**
 * Feed containing a collection of page summaries.
 *
 * @extends {BaseFeed<PageEntry>}
 */
interface PagesFeedSummary extends BaseFeed<PageEntrySummary> {
}

/**
 * Blog object containing a feed of full pages.
 *
 * @extends {BaseBlog<PagesFeed>}
 */
interface PagesBlog extends BaseBlog<PagesFeed> {
}

/**
 * Blog object containing a feed of page summaries.
 *
 * @extends {BaseBlog<PagesFeedSummary>}
 */
interface PagesBlogSummary extends BaseBlog<PagesFeedSummary> {
}

/**
 * Blog entry object containing a single full page entry.
 *
 * @extends {BaseEntryBlog<PageEntry>}
 */
interface PagesEntryBlog extends BaseEntryBlog<PageEntry> {
}

/**
 * Blog entry object containing a single page entry summary.
 *
 * @extends {BaseEntryBlog<PageEntrySummary>}
 */
interface PagesEntryBlogSummary extends BaseEntryBlog<PageEntrySummary> {
}

declare global {
  export interface ObjectConstructor {
    keys<T>(object: T): Keys<T>[];

    getOwnPropertyNames<T>(object: T): Keys<T>[];
  }
}

/**
 * Represents the result of retrieving entries from a blog feed.
 * @template T - The type of entries, extending BaseEntry
 * @template B - The type of blog feed, extending BaseBlog
 */
type EntriesResult<T extends BaseEntry = BaseEntry, B extends BaseBlog = BaseBlog> = {
  /**
   * The retrieved entries from the blog feed.
   */
  readonly entries: T[];
  /**
   * The retrieved blog.
   */
  readonly blog: B;
} & (T extends BasePostEntry ? {
  /**
   * This property has been removed in version 1.2. Use `entries` instead.
   * @deprecated
   * @see {entries}
   */
  readonly posts: T[];
} : {});
/**
 * The result type for an entries handler, determined by the feed type and route.
 * @template T - The type of feed (posts, comments, or pages)
 * @template R - The route type (summary or full)
 */
type EntriesHandlerResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> = FeedResult<T, R, EntriesResult<PostEntrySummary, PostsBlogSummary>, EntriesResult<CommentEntrySummary, CommentsBlogSummary>, EntriesResult<PageEntrySummary, PagesBlogSummary>, EntriesResult<PostEntry, PostsBlog>, EntriesResult<CommentEntry, CommentsBlog>, EntriesResult<PageEntry, PagesBlog>>;

/**
 * Interface for handling paginated blog entries.
 * @template T - The type of feed (posts, comments, or pages)
 * @template R - The route type (summary or full)
 * @template H - The handler type itself, for method chaining.
 */
interface EntriesHandler<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute, H extends EntriesHandler = EntriesHandler<T, R, any>> {
  /**
   * The total number of entries available in the blog feed.
   */
  readonly total: number;

  /**
   * Retrieves entries from a specific page of the blog feed.
   * @param page - The 1-based page number to retrieve
   * @param reverse - Whether the page is in reverse order
   */
  page(this: H, page: number, reverse?: boolean): Promise<EntriesHandlerResult<T, R>>;
}

/**
 * Options for configuring entries retrieval with route control.
 * @template T - The type of feed (posts, comments, or pages)
 * @template R - The route type (summary or full)
 */
type EntriesOptions<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> = InnerFeedOptions<FeedOptions<T, R>>;
/**
 * Options for configuring entries retrieval using the summary route.
 * @template T - The type of feed (posts, comments, or pages)
 */
type EntriesOptionsSummary<T extends FeedType = FeedType> = InnerFeedOptions<FeedOptionsSummary<T>>;

/**
 * Interface for retrieving blog entries.
 *
 * Provides methods for paginated access and individual entry retrieval.
 */
interface EntriesNamespace {
  /**
   * Creates a handler for paginated access to blog entries.
   * @template T - The type of feed (posts, comments, or pages)
   * @template R - The route type (summary or full)
   * @param options - Configuration options for the entries retrieval
   */<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: EntriesOptions<T, R>): Promise<EntriesHandler<T, R>>;

  /**
   * Creates a handler for paginated access to blog entries using the summary route.
   * @template T - The type of feed (posts, comments, or pages)
   * @param options - Configuration options for the summary entries retrieval
   */<T extends FeedType = FeedType>(options: EntriesOptionsSummary<T>): Promise<EntriesHandler<T, "summary">>;

  /**
   * Creates a handler for paginated access to blog posts using the summary route.
   * @param options - Configuration options for the summary posts retrieval
   * @since 1.2.1 The default type is `posts`
   */
  (options: PostsOptionsSummary): Promise<PostsHandler<"summary">>;

  /**
   * Creates a handler for paginated access to blog posts.
   * @template R - The route type (summary or full)
   * @param options - Configuration options for the posts retrieval
   * @since 1.2.1 The default type is `posts`
   */<R extends FeedRoute = FeedRoute>(options: PostsOptions<R>): Promise<PostsHandler<R>>;

  /**
   * Retrieves a specific entry by its ID with route control.
   * @template T - The type of feed (posts, comments, or pages)
   * @template R - The route type (summary or full)
   * @param options - Configuration options including the entry ID
   */
  byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<ByIdResult<T, R>>;

  /**
   * Retrieves a specific entry by its ID using the summary route.
   * @template T - The type of feed (posts, comments, or pages)
   * @param options - Configuration options including the entry ID
   */
  byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<ByIdResult<T, "summary">>;

  /**
   * Retrieves a specific page by its ID with route control.
   * @template R - The route type (summary or full)
   * @param options - Configuration options including the page ID
   * @since 1.2.1 The default type is `posts`
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<ByIdPostResult<R>>;

  /**
   * Retrieves a specific page by its ID using the summary route.
   * @param options - Configuration options including the page ID
   * @since 1.2.1 The default type is `posts`
   */
  byId(options: ByIdPostsOptionsSummary): Promise<ByIdPostResultSummary>;

  /**
   * Extracts or generates a URL-friendly pathname string from a blog entry.
   *
   * @example
   * createsPathname("Entry's Title") // "entry-s-title"
   *
   * @example
   * createsPathname({title: "Entry's Title"}) // "entry-s-title"
   *
   * @example
   * createsPathname(entry) // "entry-s-alternate-url"
   *
   * @param source The blog entry object or string to generate URL from.
   * @param length The maximum length for the generated URL.
   * @returns A URL-friendly pathname string derived from either the entry's alternate link or title
   * @since 1.2.1
   */
  createsPathname(source: Partial<BaseEntry> | string, length?: number): string;
}

interface WithCategoriesPost<E extends BasePostEntry = PostEntry> {
  /**
   * Number of categories to which the current {@link post} relates.
   */
  count: number;
  /**
   * The post resource.
   */
  readonly post: E;
}

type WithCategoriesPostSummary = WithCategoriesPost<PostEntrySummary>;

interface WithCategoriesPostsOptions<F = PostsFeedOptions> extends InnerFeedOptions<F> {
  /**
   * The categories of the posts to be retrieved.
   */
  categories: string[];
  /**
   * If true, the retrieved posts will have all the categories.
   */
  every?: boolean;
}

type WithCategoriesPostsOptionsSummary = WithCategoriesPostsOptions<PostsFeedOptionsSummary>;

interface WithCategoriesPostsResult {
  /**
   * The retrieved posts.
   */
  posts: WithCategoriesPost[];
  /**
   * The retrieved blog's feed.
   */
  blog: PostsBlog;
}

interface WithCategoriesPostsResultSummary {
  /**
   * The retrieved posts.
   */
  posts: WithCategoriesPostSummary[];
  /**
   * The retrieved blog's feed.
   */
  blog: PostsBlog;
}

/**
 * Interface for handling paginated blog posts.
 * @template R - The route type (summary or full)
 */
interface PostsHandler<R extends FeedRoute = FeedRoute> extends EntriesHandler<"posts", R, PostsHandler<R>> {
  /**
   * The categories with which the posts have been tagged.
   * @since 1.2
   */
  readonly categories: string[];
}

/**
 * @since 1.3.0
 */
type PostsSsrParameters = {
  /**
   * The exclusive max bound on the entry update date.
   */
  "updated-max": string;
  /**
   * The maximum number of results to be retrieved.
   */
  "max-results": number;
  /**
   * Whether to order the results by date.
   */
  "by-date": boolean;
  /**
   * The full-text query string.
   */
  q: string;
  /**
   * The 0-based index of the first result to be retrieved.
   */
  start: number;
};

/**
 * @since 1.3.0
 */
interface PostsSsrHandlerResult {
  /**
   * The parameters used in the url.
   */
  parameters: Partial<PostsSsrParameters>;
  /**
   * The relative url to the ssr page.
   */
  url: string;
}

/**
 * Interface for handling paginated blog posts.
 *
 * It is not to get the data from the posts, but to build valid urls for blogger to build all the content by itself.
 *
 * @since 1.3.0
 */
interface PostsSsrHandler extends Omit<PostsHandler<"summary">, "page"> {
  /**
   */
  readonly categories: string[];

  /**
   * Creates an object containing a valid url for blogger ssr.
   *
   * @example
   * // on query ssr
   * handler.page(1) // { url: "/search?by-date=true&max-results=12&q=label:name" }
   * handler.page(2) // { url: "/search?by-date=true&max-results=12&q=label:name&start=12" }
   *
   * // on label ssr
   * handler.page(1) // { url: "/search/label/2dcg?max-results=12" }
   * handler.page(2) // { url: "/search/label/2dcg?max-results=12&updated-max=YYYY-MM-DDThh:mm:ss-TH:TM" }
   *
   * // on default ssr
   * handler.page(1) // { url: "/" }
   * handler.page(2) // { url: "/search?max-results=12&updated-max=YYYY-MM-DDThh:mm:ss-TH:TM" }
   *
   * @param page - The 1-based page number to retrieve
   */
  page(this: PostsSsrHandler, page: number): Promise<PostsSsrHandlerResult>;
}

/**
 * The options for configuring a blog feed posts request.
 * @template R - The route type (summary or full)
 */
type PostsFeedOptions<R extends FeedRoute = FeedRoute> = Omit<FeedOptions<"posts", R>, "type">;
type PostsResult<R extends FeedRoute = FeedRoute> = Result<"posts", R>;
type PostsResultSummary = PostsResult<"summary">;
type ByIdPostResult<R extends FeedRoute = FeedRoute> = ByIdResult<"posts", R>;
type ByIdPostResultSummary = ByIdPostResult<"summary">;
/**
 * The options for configuring a summary blog posts feed request.
 */
type PostsFeedOptionsSummary = Omit<PostsFeedOptions, "route">;
/**
 * Options for configuring posts retrieval with route control.
 * @template T - The type of feed (summary, or default)
 */
type PostsOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<PostsFeedOptions<R>>;
type SsrType = "label" | "query" | "default" | "default2";

/**
 * Options for configuring ssr retrieval.
 */
interface PostsSsrOptions extends PostsOptionsSummary {
  /**
   * The ssr mode.
   */
  ssr?: SsrType;
  /**
   * The category to use on 'label' ssr.
   *
   * Ignored in other modes.
   */
  category?: string;
}

/**
 * Options for configuring posts retrieval using the summary route.
 */
type PostsOptionsSummary = InnerFeedOptions<PostsFeedOptionsSummary>;
/**
 * The options for configuring a blog feed posts request by ID.
 * @template R - The route type (summary or full)
 */
type ByIdPostsOptions<R extends FeedRoute = FeedRoute> = PostsOptions<R> & WithId;
/**
 * The options for configuring a summary blog posts feed request by ID.
 */
type ByIdPostsOptionsSummary = PostsOptionsSummary & WithId;

/**
 * Interface for retrieving blog posts.
 *
 * Provides methods for paginated access and individual entry retrieval.
 */
interface PostsNamespace {
  /**
   * Creates a handler for paginated access to blog posts using the summary route.
   * @param options - Configuration options for the summary posts retrieval
   */
  (options: PostsOptionsSummary): Promise<PostsHandler<"summary">>;

  /**
   * Creates a handler for paginated access to blog posts.
   * @template R - The route type (summary or full)
   * @param options - Configuration options for the posts retrieval
   */<R extends FeedRoute = FeedRoute>(options: PostsOptions<R>): Promise<PostsHandler<R>>;

  /**
   * Creates the thumbnail url of a post.
   * @param source The post source.
   * @param size The size of the thumbnail.
   * @param ratio The ratio of the thumbnail.
   * @returns The thumbnail url.
   *
   * @since 1.2.1 The source can be a string
   */
  createsThumbnail(source: BasePostEntry | string, size: ImageSize<number> | number, ratio?: number | string): string;

  /**
   * Retrieves the posts from the <b>summary</b> with the given categories.
   *
   * <b>Notes</b>
   * * All posts are retrieved, but it is sliced by the value of the `max-results` parameter.
   * * The `q` parameter will be replaced.
   * @param options The request options.
   */
  withCategories(options: WithCategoriesPostsOptionsSummary): Promise<WithCategoriesPostsResultSummary>;

  /**
   * Retrieves the posts from the <b>default</b> route with the given categories.
   *
   * @remarks * All posts are retrieved, but it is sliced by the value of the `max-results` parameter.
   * @param options The request options.
   */
  withCategories(options: WithCategoriesPostsOptions): Promise<WithCategoriesPostsResult>;

  /**
   * Retrieves a specific page by its ID with route control.
   * @template R - The route type (summary or full)
   * @param options - Configuration options including the page ID
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<ByIdPostResult<R>>;

  /**
   * Retrieves a specific page by its ID using the summary route.
   * @param options - Configuration options including the page ID
   */
  byId(options: ByIdPostsOptionsSummary): Promise<ByIdPostResultSummary>;

  /**
   * Creates a handler for paginated access from SSR urls.
   *
   * <b>Notes</b>
   * * In any ssr mode, the `q` parameter is ignored, except in `query` mode.
   * * For the search by tags, you can use the `label` mode and you must also pass the category name (only is available for 1).
   * @param options - Configuration options for the ssr mode.
   * */
  ssr(options: PostsSsrOptions): Promise<PostsSsrHandler>;
}

/**
 * Represents the result type for raw feed requests, mapping feed types and routes to their corresponding blog types.
 *
 * @template T - The feed type (posts, comments, or pages)
 * @template R - The feed route (summary or default)
 */
type RawResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> = FeedResult<T, R, RawPostsBlogSummary, RawCommentsBlogSummary, RawPagesBlogSummary, RawPostsBlog, RawCommentsBlog, RawPagesBlog>;
/**
 * Represents the result type for raw feed-by-ID requests, mapping feed types and routes to their corresponding blog entry types.
 *
 * @template T - The feed type (posts, comments, or pages)
 * @template R - The feed route (summary or default)
 */
type RawByIdResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> = FeedResult<T, R, RawPostsEntryBlogSummary, RawCommentsBlogSummary, RawPagesEntryBlogSummary, RawPostsEntryBlog, RawCommentsBlog, RawPagesEntryBlog>;

/**
 * Interface defining methods for interacting with raw Blogger feeds.
 *
 * Provides functionality to fetch both summary and full content feeds,
 * with options for single entries or complete feed retrieval.
 */
interface RawFeedNamespace {
  /**
   * Fetches a summary feed.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options for the feed request
   */<T extends FeedType = FeedType>(options: FeedOptionsSummary<T>): Promise<RawResult<T, "summary">>;

  /**
   * Fetches a feed with full content.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   */<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<RawResult<T, R>>;

  /**
   * Fetches a post's feed with full content.
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions<R>): Promise<RawPostsResult<R>>;

  /**
   * Fetches a summary post's feed.
   *
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  (options: PostsFeedOptionsSummary): Promise<RawPostsResultSummary>;

  /**
   * Recursively fetches all entries from a summary feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options for the feed request
   */
  all<T extends FeedType = FeedType>(options: FeedOptionsSummary<T>): Promise<RawResult<T, "summary">>;

  /**
   * Recursively fetches all entries from a full content feed.
   *
   * Makes multiple API requests as needed to retrieve the complete dataset.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   * @remarks The returned JSON represents the last request's data with accumulated entries
   */
  all<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<RawResult<T, R>>;

  /**
   * Recursively fetches all post's entries from a full content feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries.
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  all<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions<R>): Promise<RawPostsResult<R>>;

  /**
   * Recursively fetches all post's entries from a summary feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  all(options: PostsFeedOptionsSummary): Promise<RawPostsResultSummary>;

  /**
   * Fetches a single entry by ID with full content.
   *
   * @remarks * When the type is `comments`, the retrieved resource is not an entry.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options including the entry ID
   * @since 1.2
   */
  byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<RawByIdResult<T, R>>;

  /**
   * Fetches a single entry by ID with summary content.
   *
   * @remarks * When the type is `comments`, the retrieved resource is not an entry.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options including the entry ID
   * @since 1.2
   */
  byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<RawByIdResult<T, "summary">>;

  /**
   * Fetches a single post's entry by ID with full content.
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options including the entry ID
   * @since 1.2.1 The default type is `posts`
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<RawByIdPostResult<R>>;

  /**
   * Fetches a single post's entry by ID with summary content.
   *
   * @param options - Configuration options including the entry ID
   * @since 1.2.1 The default type is `posts`
   */
  byId(options: ByIdPostsOptionsSummary): Promise<RawByIdPostResultSummary>;
}

/**
 * Represents the result type for feed requests, mapping feed types and routes to their corresponding blog types.
 *
 * @template T - The feed type (posts, comments, or pages)
 * @template R - The feed route (summary or default)
 */
type Result<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> = FeedResult<T, R, PostsBlogSummary, CommentsBlogSummary, PagesBlogSummary, PostsBlog, CommentsBlog, PostsBlog>;
/**
 * Represents the result type for feed-by-ID requests, mapping feed types and routes to their corresponding blog entry types.
 *
 * @template T - The feed type (posts, comments, or pages)
 * @template R - The feed route (summary or default)
 */
type ByIdResult<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute> = FeedResult<T, R, PostsEntryBlogSummary, CommentsBlogSummary, PagesEntryBlogSummary, PostsEntryBlog, CommentsBlog, PagesEntryBlog>;

/**
 * Interface defining methods for interacting with mapped Blogger feeds.
 *
 * Provides functionality to fetch both summary and full content feeds,
 * with options for single entries or complete feed retrieval.
 */
interface FeedNamespace {
  /**
   * Fetches a summary feed.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options for the feed request
   */<T extends FeedType = FeedType>(options: FeedOptionsSummary<T>): Promise<Result<T, "summary">>;

  /**
   * Fetches a feed with full content.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   */<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<Result<T, R>>;

  /**
   * Fetches a posts feed with full content.
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request.
   *
   * @since 1.2.1 The default type is `posts`
   */<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions): Promise<PostsResult<R>>;

  /**
   * Fetches a summary posts feed.
   *
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  (options: PostsFeedOptionsSummary): Promise<PostsFeedOptionsSummary>;

  /**
   * Recursively fetches all entries from a summary feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options for the feed request
   */
  all<T extends FeedType = FeedType>(options: FeedOptionsSummary<T>): Promise<Result<T, "summary">>;

  /**
   * Recursively fetches all entries from a full content feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   */
  all<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedOptions<T, R>): Promise<Result<T, R>>;

  /**
   * Recursively fetches all entries from a full content posts feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  all<R extends FeedRoute = FeedRoute>(options: PostsFeedOptions<R>): Promise<PostsResult<R>>;

  /**
   * Recursively fetches all entries from a summary posts feed.
   *
   * @remarks * Makes multiple API requests as needed to retrieve the complete dataset.
   * @remarks * The returned JSON represents the last request's data with accumulated entries
   * @param options - Configuration options for the feed request
   * @since 1.2.1 The default type is `posts`
   */
  all(options: PostsFeedOptionsSummary): Promise<PostsResultSummary>;

  /**
   * Fetches a single entry by ID with full content.
   *
   * @remarks * When the type is `comments`, the retrieved resource is not an entry.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @template R - The feed route (summary or default)
   * @param options - Configuration options including the entry ID
   * @since 1.2
   */
  byId<T extends FeedType = FeedType, R extends FeedRoute = FeedRoute>(options: FeedByIdOptions<T, R>): Promise<ByIdResult<T, R>>;

  /**
   * Fetches a single entry by ID with summary content.
   *
   * @remarks * When the type is `comments`, the retrieved resource is not an entry.
   *
   * @template T - The feed type (posts, comments, or pages)
   * @param options - Configuration options including the entry ID
   * @since 1.2
   */
  byId<T extends FeedType = FeedType>(options: FeedByIdOptionsSummary<T>): Promise<ByIdResult<T, "summary">>;

  /**
   * Fetches a single post's entry by ID with full content.
   *
   * @template R - The feed route (summary or default)
   * @param options - Configuration options including the entry ID
   * @since 1.2.1 The default type is `posts`
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdPostsOptions<R>): Promise<ByIdPostResult<R>>;

  /**
   * Fetches a single post's entry by ID with summary content.
   *
   * @param options - Configuration options including the entry ID
   * @since 1.2.1 The default type is `posts`
   */
  byId(options: ByIdPostsOptionsSummary): Promise<ByIdPostResultSummary>;

  /**
   * The handler to make requests to the blogger feed API directly.
   */
  readonly raw: RawFeedNamespace;
}

interface QueryStringBuilderConstructor {
  new(): QueryStringBuilder;
}

interface QueryStringBuilder {
  /**
   * Changes the operator to append search terms to `AND`.
   *
   *
   * @example
   * builder
   *   .labels('first')
   *   .and()
   *   .labels('second')
   *   .build() // 'label:first label:second'
   *
   * @see {or}
   */
  and(): this;

  /**
   * Changes the operator to append search terms to `OR`.
   *
   * @example
   * builder
   *   .labels('first')
   *   .or()
   *   .labels('second')
   *   .build() // 'label:first|label:second'
   *
   * @see {and}
   */
  or(): this;

  /**
   * Sets the exact mode on.
   *
   * The next search terms will be exact.
   *
   * @example
   * builder
   *   .labels('first')
   *   .and().exact()
   *   .labels('second label') // for labels with spaces, It's recommended to use exact mode.
   *   .build() // 'label:first label:"second label"'
   *
   * @see {noExact}
   */
  exact(): this;

  /**
   * Sets the exact mode off.
   *
   * The next search terms will not be exact.
   *
   * @example
   * builder
   *   .exact()
   *   .labels('first label') // for labels with spaces, It's recommended to use exact mode.
   *   .or().noExact()
   *   .labels('second')
   *   .build() // 'label:"first label"|label:second'
   *
   * @see {exact}
   */
  noExact(): this;

  /**
   * Sets the exclude mode on.
   *
   * The next search terms will be exclusive.
   *
   * @example
   * builder
   *   .labels('first')
   *   .and().exclude()
   *   .labels('second')
   *   .build() // 'label:first -label:second'
   *
   * @see {noExclude}
   */
  exclude(): this;

  /**
   * Sets the exclude mode off.
   *
   * The next search terms will not be exclusive.
   *
   * @example
   * builder
   *   .labels('first')
   *   .and().exclude()
   *   .labels('second')
   *   .noExclude()
   *   .labels('third')
   *   .build() // 'label:first -label:second label:third'
   *
   * @see {exclude}
   */
  noExclude(): this;

  /**
   * Appends search terms to the query.
   *
   * @example
   * builder
   *    .terms('search', 'terms')
   *    .build() // 'search|terms'
   *
   * @param term The search term.
   * @param terms Other search terms.
   */
  terms(term: string, ...terms: string[]): this;

  /**
   * Appends named search terms to the query.
   *
   * @example
   * builder
   *    .named('label', 'search', 'label')
   *    .build() // 'label:search|label:label'
   * @param name The name of the search terms.
   * @param term The search term.
   * @param terms Other search terms.
   */
  named(name: string, term: string, ...terms: string[]): this;

  /**
   * Appends label search terms to the query.
   *
   * @example
   * builder.label(label) // .named('label', label)
   *
   * @param label The label names.
   * @param labels Other label names
   * @see {named}
   * @since 1.2
   */
  label(label: string, ...labels: string[]): this;

  /**
   * Appends category search terms to the query.
   *
   * @param category The category name.
   * @param categories Other category names.
   * @see {label}
   * @remarks This is an alias for {@link label}
   */
  categories(category: string, ...categories: string[]): this;

  /**
   * Appends label search terms to the query.
   *
   * @param label The label name.
   * @param labels Other label names.
   * @see {label}
   * @remarks This is an alias for {@link label}
   */
  labels(label: string, ...labels: string[]): this;

  /**
   * Appends author search terms to the query.
   *
   * @example
   * builder.author(author) // .named('author', author)
   *
   * @param author The author name.
   * @param authors Other author names.
   * @see {named}
   * @since 1.2
   */
  author(author: string, ...authors: string[]): this;

  /**
   * Appends title search terms to the query.
   *
   * @example
   * builder.title(title) // .named('title', title)
   *
   * @param title The entry title.
   * @param titles Other entry titles.
   * @since 1.2
   */
  title(title: string, ...titles: string[]): this;

  /**
   * Appends link search terms to the query.
   *
   * @example
   * builder.link("post-title") // .named("link", "post-title")
   *
   * @param link A word of the entry link.
   * @param links Other words of the entry link.
   *
   * @since 1.2.1
   */
  link(link: string, ...links: string[]): this;

  /**
   * Appends link search terms to the query.
   *
   * @param url A word of the entry link.
   * @param urls Other words of the entry link.
   *
   * @since 1.2.1
   * @remarks This is an alias for {@link link}
   */
  url(url: string, ...urls: string[]): this;

  /**
   * Clears the query string.
   *
   * @param reset Whether want to return to the initial state of the builder
   *
   * @sice 1.2.1
   */
  clear(reset?: boolean): this;

  /**
   * Returns the built query string. If It's empty, an undefined value is returned.
   */
  build(): MaybeString;
}

declare const QueryStringBuilder: QueryStringBuilderConstructor;

interface SearchParamsConstructor {
  /**
   * Instances a new search params.
   * @param source The source params.
   */
  new(source?: Partial<RequestFeedParams>): SearchParams;

  /**
   * Creates a new search parameters object.
   * @param source The search parameters or other SearchParams instance.
   * @param copy Whether to copy the search parameters.
   * @static
   */
  from(source?: Partial<RequestFeedParams> | SearchParams, copy?: boolean): SearchParams;
}

interface SearchParams {
  /**
   * The search parameters.
   */
  readonly source: Partial<RequestFeedParams>;

  /**
   * Gets the `max-results` parameter.
   * @see {RequestFeedParams.max-results}
   */
  max(): number;

  /**
   * Sets and gets the `max-results` parameter.
   * @see {RequestFeedParams.max-results}
   * @param max The new max value.
   */
  max(max: string | number): number;

  /**
   * Gets the `start-index` parameter.
   * @see {RequestFeedParams.start-index}
   */
  start(): number;

  /**
   * Sets and gets the `start-index` parameter.
   * @see {RequestFeedParams.start-index}
   * @param index The new start index.
   */
  start(index: string | number): number;

  /**
   * Gets the `published-min` parameter.
   *
   * @see {RequestFeedParams.published-min}
   */
  publishedAtLeast(): MaybeString;

  /**
   * Sets and gets the `published-min` parameter.
   * @see {RequestFeedParams.published-min}
   * @param min The new date.
   */
  publishedAtLeast(min: string): string;

  /**
   * Removes the `published-min` parameter.
   * @see {RequestFeedParams.published-min}
   */
  publishedAtLeast(min: Nullables): Nullables;

  publishedAtLeast(min?: MaybeString): MaybeString;

  /**
   * Removes the `published-max` parameter.
   * @see {RequestFeedParams.published-max}
   */
  publishedAtMost(max: Nullables): Nullables;

  /**
   * Gets the `published-max` parameter.
   * @see {RequestFeedParams.published-max}
   */
  publishedAtMost(): MaybeString;

  /**
   * Sets and gets the `published-max` parameter.
   * {@link RequestFeedParams.published-max}
   * @param max The new date.
   */
  publishedAtMost(max: string): string;

  publishedAtMost(max?: MaybeString): MaybeString;

  /**
   * Gets the `updated-min` parameter.
   * @see {RequestFeedParams.updated-min}
   */
  updatedAtLeast(): MaybeString;

  /**
   * Sets and gets the `updated-min` parameter.
   * @see {RequestFeedParams.updated-min}
   * @param min The new date.
   */
  updatedAtLeast(min: string): string;

  /**
   * Removes the `updated-min` parameter.
   * @see {RequestFeedParams.updated-min}
   */
  updatedAtLeast(min: Nullables): Nullables;

  updatedAtLeast(min?: MaybeString): MaybeString;

  /**
   * Gets the `updated-max` parameter.
   * @see {RequestFeedParams.updated-max}
   */
  updatedAtMost(): MaybeString;

  /**
   * Sets and gets the `updated-max` parameter.
   * @see {RequestFeedParams.updated-max}
   * @param max The new date.
   */
  updatedAtMost(max: string): string;

  /**
   * Removes the `updated-max` parameter.
   * @see {RequestFeedParams.updated-max}
   */
  updatedAtMost(max: Nullables): Nullables;

  updatedAtMost(max?: MaybeString): MaybeString;

  /**
   * Gets the `orderby` parameter.
   * @see {RequestFeedParams.orderby}
   */
  orderby(): OrderBy;

  /**
   * Sets and gets the `orderby` parameter.
   *
   * The value assigned will be the default one: `updated`.
   * @see {RequestFeedParams.orderby}
   */
  orderby(order: Nullables): 'updated';

  /**
   * Sets and gets the `orderby` parameter.
   * @see {RequestFeedParams.orderby}
   * @param order The new order.
   */
  orderby<O extends OrderBy>(order: O): O;

  orderby<O extends OrderBy>(order?: O): O;

  /**
   * Gets the `q` parameter.
   * @see {RequestFeedParams.q}
   * @see {QueryStringBuilder}
   */
  query(): MaybeString;

  /**
   * Sets and gets the `q` parameter.
   * @see {RequestFeedParams.q}
   * @see {QueryStringBuilder}
   * @param query The new query.
   */
  query(query: string): string;

  /**
   * Removes the `q` parameter.
   */
  query(query: Nullables): Nullables;

  query(query?: MaybeString): MaybeString;

  /**
   * Gets the `alt` parameter.
   * @see {RequestFeedParams.alt}
   */
  alt(): Alt;

  /**
   * Sets and gets the `q` parameter.
   * @see {RequestFeedParams.alt}
   */
  alt<A extends Alt>(type: A): A;

  /**
   * Sets and gets the `alt` parameter.
   *
   * The value assigned will be the default one: `json`.
   * @see {RequestFeedParams.alt}
   */
  alt(type: Nullables): "json";

  /**
   * Gets the `alt` parameter.
   * @see {RequestFeedParams.alt}
   */
  alt(type?: Maybe<Alt>): Alt;

  /**
   * Creates a new object with only the defined parameters.
   *
   * @deprecated Since 1.2 undefined or null values deletes the property from the source. Use `source` instead.
   *
   * @example
   * var params = new SearchParams();
   * params.query("title") // { source: { q: 'title' } }
   * params.max(9) // { source: { q: 'title', "max-results": 12 } }
   * params.query(undefined) // { source: { q: undefined, "max-results": 12 } }
   * var source = params.toDefined(); // { "max-results": 12 }
   *
   * @see {source}
   */
  toDefined(): Partial<RequestFeedParams>;
}

declare const SearchParams: SearchParamsConstructor;

interface SearchParamsBuilderConstructor {
  /**
   * Instances a new search params builder.
   * @param source The source params.
   */
  new(source: Partial<RequestFeedParams> | SearchParams): SearchParamsBuilder;

  /**
   * Creates a new builder from the given params
   * @param params The source params.
   * @param copy If true, creates first a new param object from the given.
   * @static
   */
  from(params?: Partial<RequestFeedParams> | SearchParams, copy?: boolean): SearchParamsBuilder;

  /**
   * Creates a new builder.
   * @static
   */
  empty(): SearchParamsBuilder;

  /**
   * The maximum value of results that the blogger feed api can retrieve.
   *
   * This number is representative, the actual value may be much lower.
   * @static
   */
  readonly maxResults: number;
}

interface SearchParamsBuilder {
  /**
   * Changes the maximum number of results to be retrieved.
   * @param max The max value. The minimum value is 1.
   */
  max(max: Maybe<number | string>): this;

  /**
   * Changes the maximum number of results to be retrieved.
   *
   * <b>Alias</b>.
   * @example
   * builder.limit(limit) // .max(limit)
   * @param limit The max value. The minimum value is 1.
   * @see {max}
   */
  limit(limit: Maybe<number | string>): this;

  /**
   * Changes the 1-based index of the first result to be retrieved.
   *
   * <b>Blogger API Note</b>
   * - This isn't a general cursoring mechanism.
   * If you first send a query with ?start-index=1&max-results=10 and then send another query with ?start-index=11&max-results=10,
   * the service cannot guarantee that the results are equivalent to ?start-index=1&max-results=20,
   * because insertions and deletions could have taken place in between the two queries.
   *
   * @param index The index value.
   */
  start(index: Maybe<number | string>): this;

  /**
   * Adds the given index to the current start index.
   * @param index The value to add.
   */
  plusStart(index: number): this;

  /**
   * Subtracts the given index from the current start index.
   * @param index The value to subtract.
   */
  minusStart(index: number): this;

  /**
   * Changes the 1-based index of the first result to be retrieved.
   *
   * <b>Alias</b>.
   * @example
   * builder.index(index) //.start(index)
   *
   * @param index The index value.
   * @see {start}
   */
  index(index: Maybe<number | string>): this;

  /**
   * Adds the given index to the current start index.
   * @param index The value to add.
   */
  plusIndex(index: number): this;

  /**
   * Subtracts the given index from the current start index.
   * @param index The value to subtract.
   */
  minusIndex(index: number): this;

  /**
   * Changes the 1-based index of the first result to be retrieved
   * according to the {@link max} value.
   * @deprecated use {@link page} instead.
   *
   * @example
   * builder.max(10)
   *  .page(2) // .start(11)
   *
   * @param page The page value. The minimum is 0.
   * @see {max}
   */
  paginated(page: Maybe<number | string>): this;

  /**
   * Changes the 1-based index of the first result to be retrieved
   * according to the {@link max} value.
   *
   * @example
   * builder.max(10)
   *  .page(2) // .start(11)
   *
   * @param page The page value. The minimum value is 0.
   * @see {max}
   * @since 1.4.0
   */
  page(page: Maybe<number | string>): this;

  /**
   * Changes the 1-based index of the first result to be retrieved
   * according to the {@link max} and total values in reverse.
   *
   * <b>Notes</b>
   * - The value of “max-results” will be changed if the page does not have enough elements according to the total.
   *
   * @example
   * builder.max(10)
   *    .repage(50, 1) // .start(40)
   *
   * @example
   *
   * builder.max(10)
   *  .repage(24, 3)
   *  .build(true) // { 'max-results': 3, 'start-index': 1 }
   *
   * builder.max(10)
   *  .repage(24, 2) // .start(4)
   *  .build() // { 'max-results': 10, 'start-index': 4 }
   *
   * @param total
   * @param page
   * @since 1.4.0
   */
  repage(total: number | string, page: Maybe<number | string>): this;

  /**
   * Changes the bounds on the entry publication date.
   *
   * - The lower bound is inclusive, whereas the upper bound is exclusive.
   * - Use the RFC 3339 timestamp format. For example: 2005-08-09T10:57:00-08:00.
   *
   * @param min The min publication date value.
   * @param max The max publication date value.
   */
  published(min: MaybeString, max?: MaybeString): this;

  /**
   * Changes the inclusive min bound on the entry publication date.
   *
   * @param min The min publication date value.
   * @see {published}
   */
  publishedAtLeast(min: MaybeString): this;

  /**
   * Changes the exclusive max bound on the entry publication date.
   *
   * @param max The max publication date value.
   * @see {published}
   */
  publishedAtMost(max: MaybeString): this;

  /**
   * Changes the bounds on the entry update date.
   *
   * - The lower bound is inclusive, whereas the upper bound is exclusive.
   * - Use the RFC 3339 timestamp format. For example: 2005-08-09T10:57:00-08:00.
   *
   * @param min The min updated date value.
   * @param max The max updated date value.
   */
  updated(min: MaybeString, max?: MaybeString): this;

  /**
   * Changes the inclusive min bound on the entry update date.
   *
   * @param min The min updated date value.
   * @see {updated}
   */
  updatedAtLeast(min: MaybeString): this;

  /**
   * Changes the exclusive min bound on the entry update date.
   *
   * @param max The max updated date value.
   * @see {updated}
   */
  updatedAtMost(max: MaybeString): this;

  /**
   * Changes the sort order applied to results.
   * @param order The sort order.
   */
  order(order: Maybe<OrderBy>): this;

  /**
   * Changes the full-text query string.
   *
   * <b>Blogger API Notes</b>
   * - When creating a query, list search terms separated by spaces, in the form q=term1 term2 term3.
   * - The Google Data service returns all entries that match all of the search terms (like using AND between terms).
   * - Like Google's web search, a Google Data service searches on complete words (and related words with the same stem), not substrings.
   * - To search for an exact phrase, enclose the phrase in quotation marks: q="exact phrase".
   * - To exclude entries that match a given term, use the form q=-term.
   * - The search is case-insensitive.
   * - Example: to search for all entries that contain the exact phrase "Elizabeth Bennet"
   * and the word "Darcy" but don't contain the word "Austen", use the following query: ?q="Elizabeth Bennet" Darcy -Austen.
   *
   * @param query The query value.
   *
   * @see {QueryStringBuilder}
   */
  query(query: MaybeString): this;

  /**
   * Changes alternative representation type.
   * @param alt The alternative representation type.
   * @since 1.2
   */
  alt(alt: Maybe<Alt>): this;

  /**
   * Clears all the parameters.
   *
   * @since 1.2.1
   */
  clear(): this;

  /**
   * Creates the search feed params.
   * @param copy If true, return a copy of the created params.
   */
  build(copy?: boolean): Partial<RequestFeedParams>;
}

declare const SearchParamsBuilder: SearchParamsBuilderConstructor;

interface QueryNamespace {
  /**
   * Creates a new query string builder.
   */
  (): QueryStringBuilder;

  /**
   * Constructor for query string builder instances.
   * @class
   */
  Builder: typeof QueryStringBuilder;

  /**
   * Splits the query into an object.
   *
   * @example
   * const splitted = split('label:this label:are label:label|label:terms "this is exact" this are terms author:"exact terms"')
   * //{
   * //  named: {
   * //    label: { exact: [], terms: [ 'this', 'are', 'label', 'terms' ] },
   * //    author: { exact: [ 'exact terms' ], terms: [] }
   * //  },
   * //  exact: [ 'this is exact' ],
   * //  terms: [ 'this', 'are', 'terms' ]
   * //}
   * @param query The search query
   */
  split(query: string): FullSplitQuery;
}

interface ParamsNamespace {
  (): SearchParamsBuilder;

  /**
   * Constructor for search parameter builder instances.
   * @class
   */
  Builder: typeof SearchParamsBuilder;
  /**
   * Constructor for search parameters handler.
   * @class
   */
  Params: typeof SearchParams;
}

interface SplitQuery {
  /**
   * The exact query terms.
   *
   * @example
   * ['"exact terms"', '"from a query"']
   */
  exact: string[];
  /**
   * The common query terms.
   *
   * @example
   * ["common", "search", "terms"]
   */
  terms: string[];
}

interface FullSplitQuery extends SplitQuery {
  /**
   * The named query terms.
   *
   * @example
   * {label: {exact: ['"search terms for"'], terms: ["named", "label", ]}}
   */
  named: Record<string, Maybe<SplitQuery>> & Object;
}

/**
 * Interface for search functionality in the blog API.
 *
 * Provides methods and types for building and manage search queries and parameters.
 */
interface SearchNamespace {
  /**
   * The handler for
   */
  query: QueryNamespace;
  params: ParamsNamespace;
  /**
   * Constructor for query string builder instances.
   * @deprecated Use `.query.Builder` instead.
   * @class
   */
  QueryStringBuilder: QueryStringBuilderConstructor;
  /**
   * Constructor for search parameter builder instances.
   * @deprecated Use `.params.Builder` instead.
   * @class
   */
  SearchParamsBuilder: SearchParamsBuilderConstructor;
  /**
   * Constructor for search parameters handler.
   * @deprecated Use `.params.Params` instead.
   * @class
   */
  SearchParams: SearchParamsConstructor;
}

/**
 * Interface for handling paginated blog comments.
 * @template R - The route type (summary or full)
 */
interface CommentsHandler<R extends FeedRoute = FeedRoute> extends EntriesHandler<"comments", R, CommentsHandler<R>> {
}

/**
 * The options for configuring a blog feed comments request.
 * @template R - The route type (summary or full)
 */
type CommentsFeedOptions<R extends FeedRoute = FeedRoute> = Omit<FeedOptions<"comments", R>, "type">;
/**
 * The options for configuring a summary blog comments feed request.
 */
type CommentsFeedOptionsSummary = Omit<CommentsFeedOptions, "route">;
/**
 * The options for configuring a blog feed comments request by ID.
 * @template R - The route type (summary or full)
 */
type ByIdCommentsOptions<R extends FeedRoute = FeedRoute> = CommentsOptions<R> & WithId;
/**
 * The options for configuring a summary blog comments feed request by ID.
 */
type ByIdCommentsOptionsSummary = CommentsOptionsSummary & WithId;
/**
 * Options for configuring comments retrieval with route control.
 * @template T - The type of feed (posts, comments, or pages)
 */
type CommentsOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<CommentsFeedOptions<R>>;
/**
 * Options for configuring comments retrieval using the summary route.
 */
type CommentsOptionsSummary = InnerFeedOptions<CommentsFeedOptionsSummary>;

/**
 * Interface for retrieving blog comments.
 *
 * Provides methods for paginated access and individual entry retrieval.
 */
interface CommentsNamespace {
  /**
   * Creates a handler for paginated access to blog comments.
   * @template R - The route type (summary or full)
   * @param options - Configuration options for the comments retrieval
   */<R extends FeedRoute = FeedRoute>(options: CommentsOptions<R>): Promise<CommentsHandler<R>>;

  /**
   * Creates a handler for paginated access to blog comments using the summary route.
   * @param options - Configuration options for the summary comments retrieval
   */
  (options: CommentsOptionsSummary): Promise<CommentsHandler<"summary">>;

  /**
   * Creates a handler for paginated access to a specific entry comments by its ID with route control.
   * @template R - The route type (summary or full)
   * @param options - Configuration options including the entry ID
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdCommentsOptions<R>): Promise<CommentsHandler<R>>;

  /**
   * Creates a handler for paginated access to a specific entry comments by its ID using the summary route.
   * @param options - Configuration options including the entry ID
   */
  byId(options: ByIdCommentsOptionsSummary): Promise<CommentsHandler<"summary">>;
}

/**
 * Interface for handling paginated blog pages.
 * @template R - The route type (summary or full)
 */
interface PagesHandler<R extends FeedRoute = FeedRoute> extends EntriesHandler<"pages", R, PagesHandler<R>> {
}

/**
 * The options for configuring a blog feed pages request.
 * @template R - The route type (summary or full)
 */
type PagesFeedOptions<R extends FeedRoute = FeedRoute> = Omit<FeedOptions<"pages", R>, "type">;
/**
 * The options for configuring a summary blog pages feed request.
 */
type PagesFeedOptionsSummary = Omit<PagesFeedOptions, "route">;
/**
 * Options for configuring pages retrieval with route control.
 * @template T - The type of feed (posts, pages, or pages)
 */
type PagesOptions<R extends FeedRoute = FeedRoute> = InnerFeedOptions<PagesFeedOptions<R>>;
/**
 * Options for configuring pages retrieval using the summary route.
 */
type PagesOptionsSummary = InnerFeedOptions<PagesFeedOptionsSummary>;
/**
 * The options for configuring a blog feed pages request by ID.
 * @template R - The route type (summary or full)
 */
type ByIdPagesOptions<R extends FeedRoute = FeedRoute> = PagesOptions<R> & WithId;
/**
 * The options for configuring a summary blog pages feed request by ID.
 */
type ByIdPagesOptionsSummary = PagesOptionsSummary & WithId;
type ByIdPageResult<R extends FeedRoute = FeedRoute> = ByIdResult<"pages", R>;
type ByIdPageResultSummary = ByIdPageResult<"summary">;

/**
 * Interface for retrieving blog pages.
 *
 * Provides methods for paginated access and individual entry retrieval.
 */
interface PagesNamespace {
  /**
   * Creates a handler for paginated access to blog pages.
   * @template R - The route type (summary or full)
   * @param options - Configuration options for the pages retrieval
   */<R extends FeedRoute = FeedRoute>(options: PagesOptions<R>): Promise<PagesHandler<R>>;

  /**
   * Creates a handler for paginated access to blog pages using the summary route.
   * @param options - Configuration options for the summary pages retrieval
   */
  (options: PagesOptionsSummary): Promise<PagesHandler<"summary">>;

  /**
   * Retrieves a specific page by its ID with route control.
   * @template R - The route type (summary or full)
   * @param options - Configuration options including the page ID
   */
  byId<R extends FeedRoute = FeedRoute>(options: ByIdPagesOptions<R>): Promise<ByIdPageResult>;

  /**
   * Retrieves a specific page by its ID using the summary route.
   * @param options - Configuration options including the page ID
   */
  byId(options: ByIdPagesOptionsSummary): Promise<ByIdPageResultSummary>;
}

interface ConvertersNamespace {
  toText(text: RawText): SimpleText;

  toNumber(text: RawText): number;

  toBool(text: RawText): boolean;

  toCategory(category: RawCategory): string;

  toCategories(category: RawCategory[]): string[];

  toAuthor(author: RawAuthor): Author;

  toAuthors(author: RawAuthor[]): Author[];

  toEntry<R extends BaseEntry = BaseEntry, T extends RawBaseEntry = RawBaseEntry>(entry: T): R;

  toFeed<R extends BaseSimpleFeed = BaseSimpleFeed, T extends RawBaseSimpleFeed = RawBaseSimpleFeed>(feed: T): R;

  toBlogEntry<R extends BaseEntryBlog = BaseEntryBlog, T extends RawBaseEntryBlog = RawBaseEntryBlog>(blog: T): R;

  toBlog<R extends BaseBlog = BaseBlog, T extends RawBaseBlog = RawBaseBlog>(blog: T): R;
}

interface Feeddy {
  /**
   * @func
   */
  buildUrl: typeof buildUrl;
  /**
   * @func
   * @since 1.2
   */
  getId: typeof getId;
  /**
   * Helper containing relative sub-routes for the blog feed API.
   * Provides path constants for different feed endpoints.
   */
  routes: Routes;
  /**
   * The handler to make mapped requests to the blogger feed API.
   * @func
   */
  feed: FeedNamespace;
  /**
   * Utility for building search queries and parameters for blog feed requests.
   * Includes builders for constructing query strings and search parameter objects.
   */
  search: SearchNamespace;
  /**
   * Handler for paginated access to blog posts.
   * @func
   */
  posts: PostsNamespace;
  /**
   * Generic handler for paginated access to blog entries.
   * Supports posts, comments and pages with configurable route types.
   * @since 1.2
   * @func
   */
  entries: EntriesNamespace;
  /**
   * Handler for paginated access to blog comments.
   * @since 1.2
   * @func
   */
  comments: CommentsNamespace;
  /**
   * Handler for paginated access to blog pages.
   * @since 1.2
   * @func
   */
  pages: PagesNamespace;
  /**
   * Handler for converters values from raw responses.
   * @since 1.4.0
   * */
  converters: ConvertersNamespace;
}

declare const feeddy: Feeddy;

export {feeddy as default};
