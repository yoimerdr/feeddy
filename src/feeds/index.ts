import {rawAll, rawGet} from "./raw";
import {FeedOptions, FeedOptionsFull, FeedOptionsSummary} from "../types/feeds/shared";
import {Blog, BlogSummary} from "../types/feeds";
import {rawBlogToBlog} from "../shared/converters";

export function all(options: Partial<FeedOptionsFull>): Promise<Blog>;
export function all(options: Partial<FeedOptionsSummary>): Promise<BlogSummary>;
export function all(options: Partial<FeedOptions>): Promise<Blog>;
export function all(options: Partial<FeedOptions>): Promise<Blog> {
  return rawAll(options)
    .then(rawBlogToBlog);
}
export function get(options: Partial<FeedOptionsFull>): Promise<Blog>;
export function get(options: Partial<FeedOptionsSummary>): Promise<BlogSummary>;
export function get(options: Partial<FeedOptions>): Promise<Blog>;
export function get(options: Partial<FeedOptions>): Promise<Blog> {
  return rawGet(options)
    .then(rawBlogToBlog);
}
