import {PromiseConstructor} from "@jstls/types/core/polyfills";
import {
  WithCategoriesPostsOptions,
  WithCategoriesPostsOptionsSummary,
  WithCategoriesPostsResult,
  WithCategoriesPostsResultSummary
} from "@/types/posts";
import {KeyableObject} from "@jstls/types/core/objects";
import {apply} from "@jstls/core/functions/apply";
import {isEmpty} from "@jstls/core/extensions/shared/iterables";
import {feedOptions} from "@/feeds/raw";
import {builderFrom, paramsFrom} from "@/search";
import {queryBuilder} from "@/search/query";
import {all} from "@/feeds";
import {freeze} from "@jstls/core/shortcuts/object";
import {len} from "@jstls/core/shortcuts/indexable";
import {BaseFeedOptions} from "@/types/feeds/options";
import {set} from "@jstls/core/objects/handlers/getset";

declare const Promise: PromiseConstructor;

export function withCategories(options: WithCategoriesPostsOptions): Promise<WithCategoriesPostsResult>;
export function withCategories(options: WithCategoriesPostsOptionsSummary): Promise<WithCategoriesPostsResultSummary>;
export function withCategories(options: KeyableObject): Promise<KeyableObject | void> {
  const categories: string[] = options.categories;

  if (apply(isEmpty, categories))
    return new Promise((_, reject) => reject("The categories are empty."));

  const feed = feedOptions(options.feed) as BaseFeedOptions<"posts">,
    params = paramsFrom(feed.params),
    builder = queryBuilder()
      .exact();

  set(feed, "type", "posts");
  apply(options.every ? builder.and : builder.or, builder);

  builderFrom(params)
    .query(
      apply(builder.categories, builder, <any> categories)
        .build()
    );


  return all(feed)
    .then(blog => freeze({
      posts: blog.feed.entry
        .map(post => ({count: len(post.category.filter(it => categories.indexOf(it) >= 0)), post}))
        .sort((a, b) => b.count - a.count)
        .slice(0, params.max()),
      blog
    }))

}
