export interface Question {
  _id: string;
  author: {
    _id: string;
    avatar?: string;
  };
  title: string;
  description: string;
  score: number;
  tags: {
    _id: string;
    name: string;
  }[];
  status: "open" |"answered"| "closed";
  upvotes: string[]; 
  downvotes: string[]; 
  createdAt: string; 
  updatedAt: string;
  upvoteCount: number;
  downvoteCount: number;
  answerCount: number;
}