import {ImageSize} from "../shared";
import {RawText} from "./entry";

/**
 * Represents an author in the blog.
 */
export interface RawAuthor {

  /**
   * The author's email address.
   */
  email: RawText;

  /**
   * The author's name.
   */
  name: RawText;

  /**
   * The url of the author's profile.
   */
  uri: RawText;

  /**
   * The image of the author.
   */
  gd$image: RawAuthorImage
}

/**
 * Represents the image of an author in the blog.
 */
export type RawAuthorImage = ImageSize & {

  /**
   * The relationship of the image.
   */
  rel: string;

  /**
   * The URL of the image.
   */
  src: string;
}
