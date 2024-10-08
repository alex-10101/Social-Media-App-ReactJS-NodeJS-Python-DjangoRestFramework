/**
 * The properties of a User
 */
export interface IUser {
  id: number;
  last_login: string;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: string;
  is_active: boolean;
  date_joined: string;
  email: string;
  coverPicture: string;
  profilePicture: string;
  city: string;
  website: string;
}

/**
 * The properties of a relationship
 */
export interface IRelationship {
  id: number;
  followerUser: number;
  followedUser: number;
  createdAt: string;
}

/**
 * The properties of a post
 */
export interface IPost {
  id: number;
  postDescription: string;
  img: string;
  createdAt: string;
  user: number;
}

/**
 * The properties of a like
 */
export interface ILike {
  id: number;
  user: number;
  post: number;
  createdAt: string;
}

/**
 * The properties of a comment
 */
export interface IComment {
  id: number;
  commentDescription: string;
  post: number;
  createdAt: string;
  user: number;
}
