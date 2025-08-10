import { ParamValue } from "next/dist/server/request/params";
import { api } from "../axios";

export async function getLatestQuestions(numberOfQuestions:number) {
  return await api.get("/questions/", {
    params: {
      limit: numberOfQuestions,
    },
  });
}



export async function deleteQuestionFromId(questionId:ParamValue, token:string|null){
  return await api.delete(`/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

export async function handleChangeVote(
  itemType:"question"|"answer",
  id: ParamValue,
  type: "upvote" | "downvote",
  token: string | null
) {
  return await api.post(
    `/votes`,
    {
      itemType: itemType,
      itemId: id,
      type,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function changeQuestionStatus2(
  questionId: ParamValue,
  newStatus: "open" | "answered" | "closed",
  token: string | null
) {
  return await api.patch(
        `/questions/${questionId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
}

export async function createQuestion(title:string,description:string,tags: string[],token:string|null){
  return await api.post(
        "/questions",
        {
          title,
          description,
          tags
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
}

export async function fetchQuestionsFilters(queryParams: URLSearchParams){
  return await api.get(`/questions?${queryParams.toString()}`);
}

export async function updateQuestion(questionId:ParamValue,title:string, description:string,tags:string[], token:string|null){
  return await api.put(
        `/questions/${questionId}`,
        {
          title,
          description,
          tags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
}