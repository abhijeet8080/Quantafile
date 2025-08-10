import { ParamValue } from "next/dist/server/request/params";
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

export async function getUserDetails( id: ParamValue){
  return await api.get(`/users/${id}`);
}

interface UpdateUserData {
  name: string;
  avatarUrl: string | undefined;
  token: string|null;
}

export async function updateUser({ name, avatarUrl, token }: UpdateUserData) {
  try {
    const res = await api.put(
      `/users/profile`,
      { username: name, avatar: avatarUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to update user", error);
    throw error; // rethrow so caller can handle
  }
}
