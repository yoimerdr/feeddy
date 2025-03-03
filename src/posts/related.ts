import {PromiseConstructor} from "../../lib/jstls/src/types/core/polyfills";
import {
  WithCategoriesPostsOptions,
  WithCategoriesPostsOptionsSummary,
  WithCategoriesPostsResult,
  WithCategoriesPostsResultSummary
} from "../types/posts";
import {KeyableObject} from "../../lib/jstls/src/types/core/objects";
import {apply} from "../../lib/jstls/src/core/functions/apply";
import {isEmpty} from "../../lib/jstls/src/core/extensions/shared/iterables";
import {feedOptions} from "../feeds/raw";
import {builderFrom, paramsFrom} from "../search";
import {queryBuilder} from "../search/query/builder";
import {all} from "../feeds";
import {freeze} from "../../lib/jstls/src/core/shortcuts/object";
import {len} from "../../lib/jstls/src/core/shortcuts/indexable";
import {BaseFeedOptions} from "../types/feeds/options";
import {set} from "../../lib/jstls/src/core/objects/handlers/getset";

declare const Promise: PromiseConstructor;

export function withCategories(options: WithCategoriesPostsOptions): Promise<WithCategoriesPostsResult>;
export function withCategories(options: WithCategoriesPostsOptionsSummary): Promise<WithCategoriesPostsResultSummary>;
export function withCategories(options: KeyableObject): Promise<KeyableObject | void> {
  const categories: string[] = options.categories;

  if (apply(isEmpty, categories))
    return new Promise((_, reject) => reject("The categories are empty."));

  const feed = feedOptions(options.feed) as BaseFeedOptions<"posts">;
  set(feed, "type", "posts");

  const params = paramsFrom(feed.params);

  const builder = queryBuilder()
    .exact();

  apply(options.every ? builder.and : builder.or, builder);

  builderFrom(params)
    .query(
      apply(builder.categories, builder, categories)
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
