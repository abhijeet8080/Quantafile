// services/questionServices.ts
import {  deleteQuestionFromId,changeQuestionStatus2, getLatestQuestions, handleChangeVote, fetchQuestionsFilters } from "@/lib/api/question";
import { api } from "@/lib/axios";
import { ParamValue } from "next/dist/server/request/params";

export const fetchQuestions = async (numberOfQuestions: number) => {
  try {
    const res = await getLatestQuestions(numberOfQuestions);
    return res.data.questions;
  } catch (err) {
    console.error("Failed to fetch questions", err);
    return []; 
  }
};

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
    return await deleteQuestionFromId(questionId,token)
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
    const res = await handleChangeVote(itemType, id, type, token);
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
    const res = await changeQuestionStatus2(questionId, newStatus, token);
    return res;
  } catch (error) {
    console.error("Failed to change vote", error);
    throw error; 
  }
};

export const fetchQuestionsWithFilters = async (queryParams: URLSearchParams) => {
  try {
    const res = await fetchQuestionsFilters(queryParams);
    return {
      questions: res.data.questions,
      totalPages: res.data.totalPages,
    };
  } catch (err) {
    console.error("Failed to fetch questions", err);
    return { questions: [], totalPages: 1 };
  }
};

