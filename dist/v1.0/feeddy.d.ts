/**
 * The route options of the blog's feed.
 */
type FeedRoute = 'summary' | "full";
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
type LinkRel = 'alternate' | 'next' | 'hub' | 'self' | 'edit' | 'http://schemas.google.com/g/2005#feed';

interface FeedOptions {
  /**
   * The blog's URL.
   */
  blogUrl: string;
  /**
   * The route of the blog's feed.
   *
   * The possible values are 'full' or 'summary'.
   */
  route: FeedRoute;
  /**
   * The parameters for the feed request.
   */
  params: Partial<RequestFeedParams>;
}

interface FeedOptionsSummary extends FeedOptions {
  /**
   * The summary route of the blog's feed.
   */
  route: 'summary';
}

interface FeedOptionsFull extends FeedOptions {
  /**
   * The full route of the blog's feed.
   */
  route: 'full';
}

interface Routes {
  /**
   * The pathname for the summary posts feed.
   */
  postsSummary(): string;

  /**
   * The pathname for the <b>default</b> posts feed.
   */
  posts(): string;
}

/**
 * The order by options for the feed request.
 */
type OrderBy = "lastmodified" | "starttime" | "updated";

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
}

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
type RawLink = {
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
};
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
 * Represents a link of a blog post.
 */
type RawPostLink = RawLink & {
  /**
   * The title of the post.
   *
   * It is only present when the post link type is `alternate`.
   */
  title?: string;
};
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
 * Represents a category of a blog post.
 */
type RawPostCategory = RawCategory & {
  /**
   * The schema of the category.
   */
  schema: string;
};

interface RawBasePost {
  /**
   * The id of the post.
   */
  id: RawText;
  /**
   * The title of the post.
   */
  title: RawTextTitle;
  /**
   * The links of the post.
   */
  link: RawPostLink[];
  /**
   * The thumbnail image of the post.
   */
  media$thumbnail: RawPostThumbnail;
  /**
   * RFC 3339 date-time when the post was last updated.
   */
  updated: RawText;
  /**
   * RFC 3339 date-time when the post was published.
   */
  published: RawText;
  /**
   * The categories with which the post has been tagged.
   */
  category: RawPostCategory[];
  /**
   * The authors who published or updated the post.
   */
  author: RawAuthor[];
}

/**
 * Represents a blog post.
 */
interface RawPostEntry extends RawBasePost {
  /**
   * The content of the post. Can contain HTML markup.
   */
  content: RawTextContent;
}

/**
 * Represents a blog post.
 */
interface RawPostEntrySummary extends RawBasePost {
  /**
   * The summary content of the post. Can contain HTML markup.
   */
  summary: RawTextTitle;
}

/**
 * Represents the blog feed.
 */
interface RawBlogFeed {
  /**
   * The blog id.
   */
  id: RawText;
  /**
   * The author of the blog.
   */
  author: RawAuthor[];
  /**
   * The categories with which the posts has been tagged.
   */
  category: RawCategory[];
  /**
   * Indicates whether the blog was marked as `for adults`.
   */
  blogger$adultContent: RawText;
  /**
   * The retrieved posts.
   */
  entry: RawPostEntry[];
  /**
   * The name of the blog, which is usually displayed in Blogger as the blog's title.
   *
   * The title can include HTML.
   */
  title: RawTextTitle;
  /**
   * The subtitle of the blog, which is usually displayed in Blogger underneath the blog's title.
   *
   * The subtitle can include HTML.
   */
  subtitle: RawTextTitle;
  /**
   * RFC 3339 date-time when the blog was last updated.
   */
  updated: RawText;
  /**
   * The links of the blog.
   */
  link: RawLink[];
  /**
   * The 1-based index of the first retrieved post.
   */
  openSearch$startIndex: RawText;
  /**
   * The total number of blog posts.
   *
   * In a request with a query (`q` parameter), this value is usually equals to the number of posts retrieved.
   */
  openSearch$totalResults: RawText;
  /**
   * The maximum number of items that appear on one page.
   *
   * Commonly is the `max-results` parameter.
   */
  openSearch$itemsPerPage: RawText;
}

type RawBlogFeedSummary = RawBlogFeed & {
  entry: RawPostEntrySummary[];
};
type RawBlog = {
  /**
   * The blog encoding.
   */
  encoding: string;
  /**
   * The blog feed.
   */
  feed: RawBlogFeed;
  version: string;
};
type RawBlogSummary = RawBlog & {
  feed: RawBlogFeedSummary;
};

interface RawFeed {
  /**
   * Makes a get request to the <b>default</b> blogger feed API using the fetch API.
   * @param options The request options.
   */
  (options: Partial<FeedOptionsFull>): Promise<RawBlog>;

  /**
   * Makes a get request to the <b>summary</b> blogger feed API using the fetch API.
   * @param options The request options.
   */
  (options: Partial<FeedOptionsSummary>): Promise<RawBlogSummary>;

  /**
   * Makes a get request to the <b>default</b> blogger feed API using the fetch API.
   * @param options The request options.
   */
  (options: Partial<FeedOptions>): Promise<RawBlog>;

  /**
   * Makes a recursive get request to the <b>default</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - The JSON retrieved will be that of the last request with some modified values.
   * - This is incompatible with the <b>q</b> (query string) param.
   *
   * @param options The request options.
   * @see {rawGet}
   */
  all(options: Partial<FeedOptionsFull>): Promise<RawBlog>;

  /**
   * Makes a recursive get request to the <b>summary</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - The JSON retrieved will be that of the last request with some modified values.
   * - This is incompatible with the <b>q</b> (query string) param.
   *
   * @param options The request options.
   * @see {rawGet}
   */
  all(options: Partial<FeedOptionsSummary>): Promise<RawBlogSummary>;

  /**
   * Makes a recursive get request to the <b>default</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   * @see {rawGet}
   */
  all(options: Partial<FeedOptions>): Promise<RawBlog>;
}

type Text = string;

interface Author {
  /**
   * The author's email address.
   */
  email: Text;
  /**
   * The author's name.
   */
  name: Text;
  /**
   * The author's profile url.
   */
  uri: Text;
  /**
   * The image of the author.
   */
  gd$image: RawAuthorImage;
}

/**
 * Represents the thumbnail of a blog post.
 */
type PostThumbnail = {
  /**
   * The image's url.
   */
  url: string;
} & ImageSize<number>;
type BasePost = {
  /**
   * The authors who published or updated the post.
   */
  author: Author[];
  /**
   * The id of the post.
   */
  id: Text;
  /**
   * The title of the post.
   */
  title: Text;
  /**
   * The links of the post.
   */
  link: RawPostLink[];
  /**
   * The categories with which the post has been tagged.
   */
  category: string[];
  /**
   * The thumbnail image of the post.
   */
  media$thumbnail: PostThumbnail;
  /**
   * RFC 3339 date-time when this post was last updated.
   */
  updated: Text;
  /**
   * RFC 3339 date-time when this post was published.
   */
  published: Text;
};
/**
 * Represents a blog post.
 */
type PostEntry = BasePost & {
  /**
   * The content of the post. Can contain HTML markup.
   */
  content: Text;
};
/**
 * Represents a blog post.
 */
type PostEntrySummary = BasePost & {
  /**
   * The summary content of the post. Can contain HTML markup.
   */
  summary: Text;
};
/**
 * Represents the blog feed.
 */
type BlogFeed = {
  /**
   * The author of the blog.
   */
  author: Author[];
  /**
   * The blog id.
   */
  id: Text;
  /**
   * The categories with which the posts has been tagged.
   */
  category: string[];
  /**
   * Indicates whether the blog was marked as `for adults`.
   */
  blogger$adultContent: boolean;
  /**
   * The name of the blog, which is usually displayed in Blogger as the blog's title.
   *
   * The title can include HTML.
   */
  title: Text;
  /**
   * The subtitle of the blog, which is usually displayed in Blogger underneath the blog's title.
   *
   * The subtitle can include HTML.
   */
  subtitle: Text;
  /**
   * The links of the blog.
   */
  link: RawLink[];
  /**
   * RFC 3339 date-time when the blog was last updated.
   */
  updated: Text;
  /**
   * The 1-based index of the first retrieved post.
   */
  openSearch$startIndex: number;
  /**
   * The total number of blog posts.
   *
   * In a request with a query (`q` parameter), this value is usually equals to the number of posts retrieved.
   */
  openSearch$totalResults: number;
  /**
   * The maximum number of items that appear on one page.
   *
   * Commonly is the `max-results` parameter.
   */
  openSearch$itemsPerPage: number;
  /**
   * The retrieved posts.
   */
  entry: PostEntry[];
};
type BlogFeedSummary = BlogFeed & {
  entry: PostEntrySummary[];
};
type Blog = {
  /**
   * The blog encoding.
   */
  encoding: string;
  version: string;
  /**
   * The blog feed.
   */
  feed: BlogFeed;
};
type BlogSummary = Blog & {
  feed: BlogFeedSummary;
};

interface Feed {
  /**
   * Makes a get request to the <b>summary</b> blogger feed API using the fetch API.
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * @param options The request options.
   */
  (options: Partial<FeedOptionsFull>): Promise<Blog>;

  /**
   * Makes a get request to the <b>summary</b> blogger feed API using the fetch API.
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * @param options The request options.
   */
  (options: Partial<FeedOptionsSummary>): Promise<BlogSummary>;

  /**
   * Makes a get request to the <b>default</b> blogger feed API using the fetch API.
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * @param options The request options.
   */
  (options: Partial<FeedOptions>): Promise<Blog>;

  /**
   * Makes a recursive get request to the <b>default</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   */
  all(options: Partial<FeedOptionsFull>): Promise<Blog>;

  /**
   * Makes a recursive get request to the <b>summary</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   */
  all(options: Partial<FeedOptionsSummary>): Promise<BlogSummary>;

  /**
   * Makes a recursive get request to the <b>default</b> blogger feed API using the fetch API
   * for retrieves all the possible results.
   *
   * - Transforms some fields of the retrieved JSON to be native types instead of objects.
   * - The JSON retrieved will be that of the last request with some modified values.
   *
   * @param options The request options.
   */
  all(options: Partial<FeedOptions>): Promise<Blog>;

  /**
   * The handler to make requests to the blogger feed API directly.
   */
  readonly raw: RawFeed;
}

interface InnerFeedOptions {
  /**
   * The blog's feed options.
   */
  feed: FeedOptions;
}

interface PaginatePostsHandler {
  /**
   * The total number of blog posts.
   */
  readonly total: number;

  /**
   * Performs a request to retrieve the posts from the specified page.
   * @param page The page number.
   */
  page(this: PaginatePostsHandler, page: number): void;
}

interface PaginatePostsOptions extends InnerFeedOptions {
  /**
   * Callback triggered after the first request to the feed is performed.
   * @param handler The paginate handler.
   * @see {SearchParamsBuilder.paginated}
   */
  onTotal(handler: PaginatePostsHandler): void;

  /**
   * Callback triggered after the {@link PaginatePostsHandler.page} request is performed.
   * @param posts The posts retrieved from the feed.
   * @param blog The retrieved blog.
   */
  onPosts(posts: PostEntry[], blog: Blog): void;
}

interface WithCategoriesPostEntry {
  /**
   * Number of categories to which the current {@link post} relates.
   */
  count: number;
  /**
   * The post resource.
   */
  readonly post: PostEntry;
}

interface WithCategoriesPostsOptions extends InnerFeedOptions {
  /**
   * The categories of the posts to be retrieved.
   */
  categories: string[];
  /**
   * If true, the retrieved posts will be have all the categories.
   */
  every?: boolean;

  /**
   * Callback triggered after the request to the feed is performed.
   * @param posts The retrieved posts.
   * @param blog The retrieved blog.
   */
  onPosts(posts: WithCategoriesPostEntry[], blog: Blog): void;
}

interface Posts {
  /**
   * Paginate the blog.
   * @param options The paginate options. All properties must be defined.
   */
  (options: PaginatePostsOptions): void;

  /**
   * Creates the thumbnail url of a post.
   * @param source The post source.
   * @param size The size of the thumbnail.
   * @param ratio The ratio of the thumbnail.
   * @returns The thumbnail url.
   */
  createsThumbnail(source: PostEntry | PostEntrySummary | RawPostEntry | RawPostEntrySummary, size: ImageSize<number> | number, ratio?: number | string): string;

  /**
   * Retrieves the posts with the given categories.
   *
   * All posts are retrieved, but it is sliced by the value of the `max-results` parameter.
   * @param options The request options.
   */
  withCategories(options: WithCategoriesPostsOptions): void;
}

interface NumberExtensions {
  /**
   * Restricts the number to be at most the given maximum.
   *
   * @param {number} maximum - The maximum value.
   * @returns {number} The coerced number, which is the smallest of the original number or the maximum.
   */
  coerceAtMost(maximum: number): number;

  /**
   * Restricts the number to be at least the given minimum.
   *
   * @param {number} minimum - The minimum value.
   * @returns {number} The coerced number, which is the largest of the original number or the minimum.
   */
  coerceAtLeast(minimum: number): number;

  /**
   * Restricts the number to be within the given range [minimum, maximum].
   *
   * @param {number} minimum - The minimum value.
   * @param {number} maximum - The maximum value.
   * @returns {number} The coerced number, which will be within the range [minimum, maximum].
   */
  coerceIn(minimum: number, maximum: number): number;

  /**
   * Checks if the number is within the inclusive range [minimum, maximum].
   *
   * @param {number} minimum - The minimum value.
   * @param {number} maximum - The maximum value.
   * @returns {boolean} True if the number is within the inclusive range [minimum, maximum], false otherwise.
   */
  isFromTo(minimum: number, maximum: number): boolean;

  /**
   * Checks if the number is within the inclusive-exclusive range [minimum, maximum].
   *
   * @param {number} minimum - The minimum value.
   * @param {number} maximum - The maximum value.
   * @returns {boolean} True if the number is within the inclusive-exclusive range [minimum, maximum], false otherwise.
   */
  isFromUntil(minimum: number, maximum: number): boolean;
}

interface NumberWithExtensions extends Number, NumberExtensions {
}

interface StringExtensions {
  /**
   * Checks if the string is empty
   * @returns {boolean} true if string is empty; otherwise false
   */
  isEmpty(): boolean;

  /**
   * Checks if the string is not empty
   * @returns {boolean} true if string is not empty; otherwise false
   */
  isNotEmpty(): boolean;

  toInt(radix?: number): MaybeNumber;

  toFloat(): MaybeNumber;
}

interface StringWithExtensions extends String, StringExtensions {
}

type CountsCompareFn<T, A, R> = (this: R, target: T, current: T, index: number, arr: A) => boolean;

interface ArrayExtensions<T> {
  /**
   * Gets the first element of the array
   * @returns {T} The first element if array is not empty.
   * @template T
   * @throws {IllegalAccessError} If the array {@link isEmpty}
   */
  first(): T;

  /**
   * Gets the first element of the array
   * @template T
   * @returns {Maybe<T>} The first element if array is not empty; otherwise undefined
   */
  firstOrNull(): Maybe<T>;

  /**
   * Counts how many value occurrences exist in the array.
   *
   * The default compare fn check if that values are equal with === operator.
   *
   * @param value The value for counts.
   * @param compare The compare fn. It must return true if you want to count the current item.
   * @param thisArg The this compare fn arg.
   * @returns {number} The number of occurrences
   *
   * @throws IllegalArgumentError If the param value is undefined.
   */
  counts<R>(value: T, compare?: CountsCompareFn<T, this, R>, thisArg?: R): number;

  /**
   * Check if array is empty
   *
   * @returns {boolean} true if array is empty; otherwise false
   */
  isEmpty(): boolean;

  /**
   * Check if array is not empty
   * @returns {boolean} true if array is not empty; otherwise false
   */
  isNotEmpty(): boolean;

  filterDefined(): NonNullable<T>[];

  /**
   * Extend current array pushing each element from source array
   * @template T
   *
   * @param {T[]} source An array with elements for extend current array.
   */
  extends(source: T[]): this;

  /**
   * Gets the last element of the array
   * @returns {Maybe<T>} The first element if array is not empty.
   * @template T
   * @throws {IllegalAccessError} If the array {@link isEmpty}
   */
  last(): T;

  /**
   * Gets the last element of the array
   * @template T
   * @returns {Maybe<T>} The first element if array is not empty; otherwise undefined
   */
  lastOrNull(): Maybe<T>;
}

interface ArrayWithExtensions<T> extends Array<T>, ArrayExtensions<T> {
}

type Nullables = undefined | null;
/**
 * Refers to a null or undefined type T.
 */
type Maybe<Ty> = Ty | Nullables;
/**
 * Refers to a null or undefined type number.
 */
type MaybeNumber = Maybe<number>;
/**
 * Refers to a null or undefined type string.
 */
type MaybeString = Maybe<string>;
declare global {
  interface Number extends NumberExtensions {
  }

  interface String extends StringExtensions {
  }

  interface Array<T> extends ArrayExtensions<T> {
  }

  interface ArrayConstructor {
    readonly prototype: ArrayWithExtensions<any>;
  }

  interface StringConstructor {
    readonly prototype: StringWithExtensions;
  }

  interface NumberConstructor {
    readonly prototype: NumberWithExtensions;
  }
}

/**
 * @class
 * The builder for create a search query string.
 */
declare class QueryStringBuilder {
  constructor();

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
   * @param term The search term.
   */
  terms(...term: string[]): this;

  /**
   * Appends named search terms to the query.
   * @param name The name of the search terms.
   * @param term The search term.
   */
  named(name: string, ...term: string[]): this;

  /**
   * Appends category search terms to the query.
   *
   * <b>Alias</b>
   * @example
   * builder.categories(...category) // .named('label', ...category)
   *
   * @param category The category o category names.
   * @see {terms}
   */
  categories(...category: string[]): this;

  /**
   * Appends category search terms to the query.
   *
   * <b>Alias</b>
   * @example
   * builder.labels(label) // .categories(label)
   *
   * @param label The category o category names.
   * @see {categories}
   */
  labels(...label: string[]): this;

  /**
   * Returns the built query string. If It's empty, an undefined value is returned.
   */
  build(): MaybeString;
}

/**
 * Creates a new query string builder.
 */
declare function queryBuilder(): QueryStringBuilder;

/**
 * @class
 * The class for managing search parameters.
 */
declare class SearchParams {
  /**
   * The search parameters.
   */
  readonly source: Partial<RequestFeedParams>;

  constructor(source?: Partial<RequestFeedParams>);

  /**
   * Creates a new search parameters object.
   * @param source The search parameters or other SearchParams instance.
   * @param copy Whether to copy the search parameters.
   */
  static from(source?: Partial<RequestFeedParams> | SearchParams, copy?: boolean): SearchParams;

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

  /**
   * Gets the `orderby` parameter.
   * @see {RequestFeedParams.orderby}
   */
  orderby(): OrderBy;
  /**
   * Sets and gets the `orderby` parameter.
   *
   * The value assigned will be the default one: `lastmodified`.
   * @see {RequestFeedParams.orderby}
   */
  orderby(order: Nullables): 'lastmodified';
  /**
   * Sets and gets the `orderby` parameter.
   * @see {RequestFeedParams.orderby}
   * @param order The new order.
   */
  orderby<O extends OrderBy>(order: O): O;

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

  alt(type: 'json' | 'rss'): void;

  /**
   * Creates a new object with only the defined parameters.
   *
   * @example
   * var params = new SearchParams();
   * params.query("title") // { source: { q: 'title' } }
   * params.max(9) // { source: { q: 'title', "max-results": 12 } }
   * params.query(undefined) // { source: { q: undefined, "max-results": 12 } }
   * var source = params.toDefined(); // { "max-results": 12 }
   */
  toDefined(): Partial<RequestFeedParams>;
}

declare class SearchParamsBuilder {
  protected readonly __params__: SearchParams;

  private constructor();

  /**
   * Creates a new builder from the given params
   * @param params The source params.
   * @param copy If true, creates first a new param object from the given.
   */
  static from(params?: Partial<RequestFeedParams> | SearchParams, copy?: boolean): SearchParamsBuilder;

  /**
   * Creates a new builder.
   */
  static empty(): SearchParamsBuilder;

  /**
   * The maximum value of results that the blogger feed api can retrieve.
   */
  static get maxResults(): number;

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
   *
   * @example
   * builder.max(10)
   *  .paginated(2) // .start(11)
   *
   * @param page The page value. The minimum is 0.
   * @see {max}
   */
  paginated(page: Maybe<number | string>): this;

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
   * <b>Alias</b>.
   * @example
   * builder.publishedAtLeast(min) // .published(min)
   * @param min The min publication date value.
   * @see {published}
   */
  publishedAtLeast(min: MaybeString): this;

  /**
   * Changes the exclusive max bound on the entry publication date.
   *
   * <b>Alias</b>.
   * @example
   * builder.publishedAtMost(max) // .published(undefined, max)
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
   * <b>Alias</b>.
   * @example
   * builder.updatedAtLeast(min) // .updated(min)
   * @param min The min updated date value.
   * @see {updated}
   */
  updatedAtLeast(min: MaybeString): this;

  /**
   * Changes the exclusive min bound on the entry update date.
   *
   * <b>Alias</b>.
   * @example
   * builder.updatedAtMost(max) // .updated(undefined, max)
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
   * @see {queryBuilder}
   * @see {QueryStringBuilder}
   */
  query(query: MaybeString): this;

  /**
   * Creates the search feed params.
   * @param copy If true, return a copy of the created params.
   */
  build(copy?: boolean): Partial<RequestFeedParams>;
}

/**
 * Creates an empty search params builder.
 */
declare function paramsBuilder(): SearchParamsBuilder;

interface Search {
  query: typeof queryBuilder;
  QueryStringBuilder: typeof QueryStringBuilder;
  params: typeof paramsBuilder;
  SearchParamsBuilder: typeof SearchParamsBuilder;
}

interface Feeddy {
  buildUrl: typeof buildUrl;
  routes: Routes;
  feed: Feed;
  search: Search;
  posts: Posts;
}

declare var feeddy: Feeddy;


