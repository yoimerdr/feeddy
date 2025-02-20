import {SimpleText} from "./entry";
import {RawAuthorImage} from "./raw/author";

/**
 * Represents an author in the blog.
 */
export interface Author {

  /**
   * The author's email address.
   */
  email: SimpleText;

  /**
   * The author's name.
   */
  name: SimpleText;

  /**
   * The url of the author's profile.
   */
  uri: SimpleText;

  /**
   * The image of the author.
   */
  gd$image: RawAuthorImage
}
