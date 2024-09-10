import {Posts} from "./types/posts";
import {paramsBuilder} from "./search";

export * from "./module";

paramsBuilder()
  .limit(12)

export declare const posts: Posts;
