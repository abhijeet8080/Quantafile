import { api } from "../axios";


export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
}) {
  return api.post("/auth/register", data);
}


export async function loginUser(data: { email: string; password: string }) {
  return api.post("/auth/login", data);
}


export async function verifyEmailWithToken(token: string) {
  return api.get(`/auth/verify-email/${token}`);
}

