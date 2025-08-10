export interface Answer {
  _id: string;
  question: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  score: number;
  isBestAnswer: boolean;
  comments: {
    author: { _id: string; username: string, avatar:string };
    content: string;
    createdAt: string;
  }[];
  upvotes: string[];
  downvotes: string[];
  createdAt: string;
  updatedAt: string;
}
