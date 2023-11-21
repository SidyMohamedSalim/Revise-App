import { randomInt } from "crypto";
import { QuizQuestion, quizData } from "./data";

export const generateIndexQuizz = (data: QuizQuestion[]) => {
  const Allindex: number[] = [];
  for (let i = 0; i < 4; i++) {
    let rdint: number;
    do {
      rdint = randomInt(data.length);
    } while (Allindex.find((value) => value === rdint));
    Allindex.push(rdint);
  }

  return Allindex;
};

export const generateArrayQuizz = () => {
  // logique chatgpt
  //  data  recuperer sur chatgpt
  const data = quizData;

  const TabIndex = generateIndexQuizz(data);

  const arrayQuizz = TabIndex.map((index) => data[index]);

  return arrayQuizz;
};

export const CompareResult = (
  ResponseUser: string,
  CorrectAnswer: string
): number => {
  return ResponseUser === CorrectAnswer ? 1 : 0;
};

export const quizzStart = () => {};
