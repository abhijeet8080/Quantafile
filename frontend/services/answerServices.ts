import { api } from "@/lib/axios";
import { ParamValue } from "next/dist/server/request/params";

export async function createAnswer(questionId:ParamValue, content:string, token:string|null){
  return await api.post(
        `/answers`,
        { questionId:questionId,content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
}

export async function deleteAnswer(answerId:string, token:string|null){
  return await api.delete(`/answers/${answerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
}

export async function markBestAnswer(answerId:string, token:string|null){
  return await api.put(`/answers/${answerId}/best`,{}, {
        headers: { Authorization: `Bearer ${token}` }
      });
}

export async function addCommentToAnswer(
  answerId: string,
  content: string,
  token: string | null
) {
  return await api.post(
    `/answers/${answerId}/comments`,
    { content }, 
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export const deleteAnswerAdmin = async (
  answerId: ParamValue,
  reason: string,
  token: string | null
) => {
  try {
    const res = await api.delete(`/answers/${answerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { reason }, 
    });
    return res.data;
  } catch (error) {
    console.error("Failed to delete answer as admin", error);
    throw error;
  }
};
