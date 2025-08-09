export interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
  avatar?: string;
  isVerified: boolean;
  role: string;
  isBanned: boolean;
}