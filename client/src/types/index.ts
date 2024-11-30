export interface Question {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  likes: string[];
  dislikes: string[];
  comments: Comment[];
  isApproved: boolean;
  createdAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  content: string;
  createdAt: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role?: string;
  createdAt: string;
}
