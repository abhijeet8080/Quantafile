// hooks/useFetchLatestQuestions.ts
import { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { fetchQuestionDetails, fetchQuestions, fetchQuestionsWithFilters } from "@/services/questionServices";
import { ParamValue } from "next/dist/server/request/params";
import { toast } from "sonner";

export function useFetchLatestQuestions(numberOfQuestions: number) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchQuestions(numberOfQuestions)
      .then((data) => {
        if (data) setQuestions(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [numberOfQuestions]);

  return { questions, loading };
}


export function useGetQuestionFromId(questionId:ParamValue){
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);
  useEffect(() => {
    setLoading(true);
    fetchQuestionDetails(questionId).then((data)=>{
      if(data){
        setQuestion(data)
        setUpvoteCount(data.upvoteCount)
        setDownvoteCount(data.downvoteCount)}
      })
      .catch(console.error)
    .finally(()=>setLoading(false))
  }, [questionId]);
  return {question,loading, setQuestion,upvoteCount,downvoteCount,setUpvoteCount,setDownvoteCount}
  
}
export function useGetQuestionsWithFilters(queryParams: URLSearchParams) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchQuestionsWithFilters(queryParams)
      .then(({ questions, totalPages }) => {
        if (questions) setQuestions(questions);
        if (totalPages) setTotalPages(totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [queryParams]);

  return { questions, totalPages, loading };
}


export function useQuestionDetails(questionId: ParamValue) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!questionId) return; 

    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const res = await fetchQuestionDetails(questionId);
        
        setQuestion(res);
        setTitle(res.title);
        setDescription(res.description);
        setTags(res.tags.map((t: { _id: string; name: string }) => t.name).join(", "));
      } catch (err) {
        toast.error("Failed to fetch question.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  return { question, title, setTitle, description, setDescription, tags, setTags, loading };
}