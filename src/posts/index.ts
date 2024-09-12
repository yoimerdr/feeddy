import {PaginatePostsHandler, PaginatePostsOptions, WithCategoriesPostsOptions} from "../types/posts";
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

export const thumbnailSizeExpression: string = 's72-c';

export function posts(options: PaginatePostsOptions) {
  requireObject(options, 'options');
  options.feed = getIf(options.feed, isObject, () => (<FeedOptions>{}));
  const params = SearchParams.from(options.feed.params);

  function changePage(this: PaginatePostsHandler, page: number) {
    options.feed.params = SearchParamsBuilder.from(params)
      .paginated(page)
      .build();

    get(options.feed)
      .then(blog => {
        if (!isDefined(blog))
          return;

        options.onPosts(blog!.feed.entry, blog!)
      })
  }

  (params.query() ? all : get)(options.feed)
    .then(blog => {
      if (blog.feed.openSearch$totalResults > 0) {
        options.onTotal(Object.freeze({
          total: blog.feed.openSearch$totalResults,
          page: changePage
        }));
      }
    })
    .catch(console.error)
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

export function withCategories(options: WithCategoriesPostsOptions) {
  const categories: string[] = options.categories;

  if (categories.isEmpty())
    return;

  const feed = feedOptions(options.feed);
  const params = SearchParams.from(feed.params);

  const builder = letValue(queryBuilder(), (it) => apply((options.every ? it.and : it.or), it));

  SearchParamsBuilder.from(params)
    .query(
      apply(builder.categories, builder, categories)
        .build()
    );


  all(feed)
    .then(blog => {
      options.onPosts(
        blog.feed.entry
          .map(post => ({count: post.category.filter(it => categories.indexOf(it) >= 0).length, post}))
          .sort((a, b) => b.count - a.count)
          .slice(0, params.max()),
        blog
      );
    })
}
