import {
  PaginatePostsHandler,
  PaginatePostsOptions,
  PaginatePostsOptionsSummary,
  PaginatePostsSummaryHandler,
  WithCategoriesPostsOptions,
  WithCategoriesPostsOptionsSummary,
  WithCategoriesPostsResult,
  WithCategoriesPostsResultSummary
} from "../types/posts";
import {FeedOptions, ImageSize} from "../types/feeds/shared";
import {SearchParams, SearchParamsBuilder} from "../search";
import {all, get} from "../feeds";
import {PostEntry, PostEntrySummary} from "../types/feeds";
import {RawPostEntry, RawPostEntrySummary} from "../types/feeds/raw";
import {feedOptions} from "../feeds/raw";
import {getDefined, getIf, requireObject} from "../../lib/jstls/src/core/objects/validators";
import {isDefined, isObject} from "../../lib/jstls/src/core/objects/types";
import {letValue, string} from "../../lib/jstls/src/core/objects/handlers";
import {parseSize} from "../../lib/jstls/src/core/geometry/size/size";
import {KeyableObject} from "../../lib/jstls/src/types/core/objects";
import {queryBuilder} from "../search/query/builder";
import {apply} from "../../lib/jstls/src/core/functions/apply";
import {isEmpty} from "../../lib/jstls/src/core/extensions/shared/iterables";
import {PromiseConstructor} from "../../lib/jstls/src/types/core/polyfills";

export const thumbnailSizeExpression: string = 's72-c';

export function posts(options: PaginatePostsOptions): Promise<PaginatePostsHandler>;
export function posts(options: PaginatePostsOptionsSummary): Promise<PaginatePostsSummaryHandler>;
export function posts(options: KeyableObject): Promise<KeyableObject> {
  requireObject(options, 'options');
  options.feed = getIf(options.feed, isObject, () => (<FeedOptions>{}));
  const {feed} = options;
  const params = SearchParams.from(feed.params);

  function changePage(this: PaginatePostsHandler, page: number) {
    feed.params = SearchParamsBuilder.from(params)
      .paginated(page)
      .build();

    return get(feed)
      .then(blog => Object.freeze({
        posts: isDefined(blog) ? blog!.feed.entry : [],
        blog
      }));
  }

  return (params.query() ? all : get)(feed)
    .then(blog => Object.freeze({
      total: blog.feed.openSearch$totalResults,
      page: changePage
    }))
}

function toFormatSize(size: ImageSize<number> | number | string): string {
  return isObject(size) ? `${string((<ImageSize<number>>size).width)}:${string((<ImageSize<number>>size).height)}` : string(size);
}

export function postThumbnail(source: PostEntry | PostEntrySummary | RawPostEntry | RawPostEntrySummary, size: ImageSize<number> | number | string, ratio?: string | number): string {
  const parse = parseSize(<any>function (this: KeyableObject, width: number, height: number) {
    this.width = Math.round(width);
    this.height = Math.round(height);
    this.adjust = function () {
      return this;
    }
    this.ratio = function () {
      return this.height === 0 ? 0 : this.width / this.height;
    }

  }, isObject, toFormatSize(size), getDefined(ratio, () => 16 / 9));
  const expression = `w${parse.width}-h${parse.height}-p-k-no-nu`;
  return source.media$thumbnail
    .url.replace(`/${thumbnailSizeExpression}/`, `/${expression}/`)
    .replace(`=${thumbnailSizeExpression}`, `=${expression}`);
}

declare const Promise: PromiseConstructor;

export function withCategories(options: WithCategoriesPostsOptions): Promise<WithCategoriesPostsResult>;
export function withCategories(options: WithCategoriesPostsOptionsSummary): Promise<WithCategoriesPostsResultSummary>;
export function withCategories(options: KeyableObject): Promise<KeyableObject | void> {
  const categories: string[] = options.categories;

  if (apply(isEmpty, categories))
    return new Promise((_, reject) => reject("The categories are empty."));

  const feed = feedOptions(options.feed);
  const params = SearchParams.from(feed.params);

  const builder = letValue(queryBuilder(), (it) => apply((options.every ? it.and : it.or), it));

  SearchParamsBuilder.from(params)
    .query(
      apply(builder.categories, builder, categories)
        .build()
    );


  return all(feed)
    .then(blog => Object.freeze({
      posts: blog.feed.entry
        .map(post => ({count: post.category.filter(it => categories.indexOf(it) >= 0).length, post}))
        .sort((a, b) => b.count - a.count)
        .slice(0, params.max()),
      blog
    }))

}
