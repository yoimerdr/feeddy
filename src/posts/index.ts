import {
  PaginatePostsHandler,
  PaginatePostsOptions,
  PaginatePostsOptionsSummary,
  PaginatePostsSummaryHandler,
} from "../types/posts";
import {FeedOptions} from "../types/feeds/shared";
import {builderFrom, paramsFrom} from "../search";
import {all, get} from "../feeds";
import {getIf, requireObject} from "../../lib/jstls/src/core/objects/validators";
import {isDefined, isObject} from "../../lib/jstls/src/core/objects/types";
import {KeyableObject} from "../../lib/jstls/src/types/core/objects";
import {freeze} from "../../lib/jstls/src/core/shortcuts/object";

export const thumbnailSizeExpression: string = 's72-c';

export function posts(options: PaginatePostsOptions): Promise<PaginatePostsHandler>;
export function posts(options: PaginatePostsOptionsSummary): Promise<PaginatePostsSummaryHandler>;
export function posts(options: KeyableObject): Promise<KeyableObject> {
  requireObject(options, 'options');
  options.feed = getIf(options.feed, isObject, () => (<FeedOptions>{}));
  const {feed} = options;
  const params = paramsFrom(feed.params), max = params.max();
  const builder = builderFrom(params);

  function changePage(this: PaginatePostsHandler & KeyableObject, page: number) {
    feed.params = builder
      .paginated(page)
      .build();

    return get(feed)
      .then(blog => freeze({
        posts: isDefined(blog) ? blog!.feed.entry : [],
        blog
      }));
  }

  if (!params.query())
    params.max(1)

  return (params.query() ? all : get)(feed)
    .then(blog => {
      builder.max(max);
      const handler = freeze({
        total: blog.feed.openSearch$totalResults,
        page: changePage,
        categories: freeze(blog.feed.category)
      });
      delete (blog as KeyableObject).feed;
      return handler;
    })
}


