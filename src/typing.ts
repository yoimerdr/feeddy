import {buildUrl, getId} from "./shared";
import {Routes} from "./types/feeds/shared";
import {Feed} from "./types/feeds";
import {Search} from "./types/search";
import {Posts} from "./types/posts";
import {Entries} from "./types/entries";
import {Comments} from "./types/comments";
import {Pages} from "./types/pages";

interface Feeddy {
  buildUrl: typeof buildUrl;
  getId: typeof getId;
  routes: Routes;
  feed: Feed;
  search: Search;
  posts: Posts;
  entries: Entries;
  comments: Comments,
  pages: Pages
}

declare const feeddy: Feeddy;

export default feeddy;
