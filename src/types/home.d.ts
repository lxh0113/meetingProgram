interface User {
  id: number;
  account: string;
  avatar: string;
  email: string;
  phone: string;
  sex: string;
  username: string;
  password?: string;
}

export interface UpdateUser {
  account: string;
  avatar: string;
  email: string;
  phone: string;
  sex: string;
  username: string;
  password?: string;
}

interface UserInfo extends User {
  likeCount: number;
  postCount: number;
  postIds: Array<number>;
  meetingIds: Array<number>;
}

interface RegisterData {
  email: string;
  emailCaptcha: string;
  password: string;
  phone?: string;
  phoneCaptcha?: string;
  sex?: string;
  username?: string;
}

interface Post {
  id: number;
  createTime: string;
  views: number;
  likes: number;
  favorites: number;
  label: string;
  content: string;
  author: string;
  status: string;
}

interface PublishPost {
  createTime: string;
  views: number;
  likes: number;
  favorites: number;
  label: string;
  content: string;
}

interface ReplyPost {
  postId: number;
  commentId: number;
  userId: number;
  time: string;
  parentCommentId: number;
  parentUsername: string;
  likes: number;
  views: number;
  favorites: number;
  comment: number;
}

interface ViewPost extends Post {
  authorId: number;
  userInfoVo: UserInfo;
  authorPostCount: number;
  comments: Array<ReplyPost>;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalComments: number;
}

export type ReplyComment = {
  userId: number;
  time: string;
  parentCommentId: number;
  comment: string;
};

export { User, UserInfo, RegisterData, Post, PublishPost, ReplyPost, ViewPost };

export type Nav = {
  path: string;
  icon: string;
  text: string;
};

export type NavList = Array<Nav>;

export type Message = {
  id: number;
  userId: number;
  content: string;
  createTime: string;
  title: string;
  status: string;
};

export type MessageList = Array<Message>;
