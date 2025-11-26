import {
  WithCategoriesPostsOptions,
  WithCategoriesPostsOptionsSummary,
  WithCategoriesPostsResult,
  WithCategoriesPostsResultSummary
} from "@feeddy/types/posts";
import {KeyableObject} from "@jstls/types/core/objects";
import {apply} from "@jstls/core/functions/apply";
import {isEmpty} from "@jstls/core/extensions/shared/iterables";
import {feedOptions} from "@feeddy/feeds/raw";
import {builderFrom, paramsFrom} from "@feeddy/search";
import {queryBuilder} from "@feeddy/search/query";
import {all} from "@feeddy/feeds";
import {freeze} from "@jstls/core/shortcuts/object";
import {len} from "@jstls/core/shortcuts/indexable";
import {BaseFeedOptions} from "@feeddy/types/feeds/options";
import {set} from "@jstls/core/objects/handlers/getset";
import {reject} from "@jstls/core/polyfills/promise/fn";
import {descsort} from "@jstls/core/utils/sorts/fn";

export function withCategories(options: WithCategoriesPostsOptions): Promise<WithCategoriesPostsResult>;
export function withCategories(options: WithCategoriesPostsOptionsSummary): Promise<WithCategoriesPostsResultSummary>;
export function withCategories(options: KeyableObject): Promise<KeyableObject | void> {
  const categories: string[] = options.categories;

  if (isEmpty(categories))
    return reject<any>("The categories are empty.");

  const feed = feedOptions(options.feed) as BaseFeedOptions<"posts">,
    params = paramsFrom(feed.params),
    builder = queryBuilder()
      .exact();

  set(feed, "type", "posts");
  apply(options.every ? builder.and : builder.or, builder);

  builderFrom(params)
    .query(
      apply(builder.categories, builder, <any>categories)
        .build()
    );


  return all(feed)
    .then(blog => freeze({
      posts: blog.feed.entry
        .map(post => ({count: len(post.category.filter(it => categories.indexOf(it) >= 0)), post}))
        .sort(descsort('count'))
        .slice(0, params.max()),
      blog
    }))

}
