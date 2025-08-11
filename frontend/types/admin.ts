export type Role = "user" | "moderator" | "admin";

export type UserType = {
  _id: string;
  username: string;
  email: string;
  role: Role;
  isBanned: boolean;
  createdAt: string;
  reputation?: number;
};
export type TagType = { _id: string; name: string; description?: string; createdAt?: string };


export type QuestionType = {
  _id: string;
  title: string;
  description: string;
  author: Partial<UserType> | string;
  status: "open" | "answered" | "closed";
  tags: TagType[] | string[];
  createdAt: string;
};

export type AnswerType = {
  _id: string;
  content: string;
  author: Partial<UserType> | string;
  question: Partial<QuestionType> | string;
  createdAt: string;
};

export type LogType = {
  _id: string;
  action: string;
  targetModel: string;
  targetId: string;
  reason?: string;
  performedBy: Partial<UserType> | string;
  createdAt: string;
};