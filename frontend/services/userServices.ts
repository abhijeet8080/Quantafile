import { api } from "@/lib/axios";
import { ParamValue } from "next/dist/server/request/params";

export async function getUserDetails(id: ParamValue, token?: string|null) {
  return await api.get(`/users/profile/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
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
    throw error; 
  }
}