
export interface User {
  id: string;
  username: string;
  password?: string; // Should not be sent to frontend in a real app
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorUsername: string;
  createdAt: string;
  coverImage?: string;
}

export interface Comment {
  id: string;
  text: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  createdAt: string;
}