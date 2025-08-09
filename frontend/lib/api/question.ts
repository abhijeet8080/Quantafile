import { api } from "../axios";

export async function getLatestQuestions(numberOfQuestions:number) {
  return await api.get("/questions/", {
    params: {
      limit: numberOfQuestions,
    },
  });
}
