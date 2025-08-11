// services/questionServices.ts
import { api } from "@/lib/axios";
import { ParamValue } from "next/dist/server/request/params";

export const fetchQuestions = async (numberOfQuestions: number) => {
  try {
    const res = await api.get("/questions/", {
    params: {
      limit: numberOfQuestions,
    },
  });
    return res.data.questions;
  } catch (err) {
    console.error("Failed to fetch questions", err);
    return []; 
  }
};
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
export const fetchQuestionDetails= async(questionId:ParamValue)=>{
  try {
    const res = await await api.get(`/questions/${questionId}`);  
    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error("Failed to fetch questions", error);
    return {}; 
  }
}

export const deleteQuestion = async(questionId:ParamValue, token:string|null)=>{
  try {
    return await await api.delete(`/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  } catch (error) {
    console.error("Failed to delete question", error);
    throw error
  }
}

export const changeVote = async (
  itemType:'question'|'answer',
  id: ParamValue,
  type: "upvote" | "downvote",
  token: string | null
) => {
  try {
    const res = await await api.post(
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
    return res;
  } catch (error) {
    console.error("Failed to change vote", error);
    throw error; 
  }
};

export const changeQuestionStatus = async (
  questionId: ParamValue,
  newStatus: "open" | "answered" | "closed",
  token: string | null
) => {
  try {
    const res = await await api.patch(
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
    return res;
  } catch (error) {
    console.error("Failed to change vote", error);
    throw error; 
  }
};

export const fetchQuestionsWithFilters = async (queryParams: URLSearchParams) => {
  try {
    const res = await  api.get(`/questions?${queryParams.toString()}`);
    return {
      questions: res.data.questions,
      totalPages: res.data.totalPages,
    };
  } catch (err) {
    console.error("Failed to fetch questions", err);
    return { questions: [], totalPages: 1 };
  }
};

export const deleteQuestionAdmin = async (
  questionId: ParamValue,
  reason: string,
  token: string | null
) => {
  try {
    const res = await api.delete(`/questions/${questionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { reason }, 
    });
    return res.data;
  } catch (error) {
    console.error("Failed to delete question as admin", error);
    throw error;
  }
};
