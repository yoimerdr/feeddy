import {
  RawBaseBlog,
  RawBaseEntry,
  RawBaseEntryBlog,
  RawBaseSimpleFeed,
  RawCategory,
  RawText
} from "@feeddy/types/feeds/raw/entry";
import {BaseBlog, BaseEntry, BaseEntryBlog, BaseSimpleFeed, SimpleText} from "@feeddy/types/feeds/entry";
import {RawAuthor} from "@feeddy/types/feeds/raw/author";
import {Author} from "@feeddy/types/feeds/author";

export interface ConvertersNamespace {
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
