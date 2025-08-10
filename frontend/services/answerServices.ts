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
  console.log("Token from", {},token)
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