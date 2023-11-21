"use client";
import { QuizQuestion } from "@/lib/data";
import React, { useState } from "react";
import { QuizzForm, optionType } from "./QuizzForm";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Progress } from "../ui/progress";
import { UseQUizzStore } from "@/src/zustand/store";
import { decrementNumberAction } from "@/app/actions/quizz.action";

export type QuizzProgressType = {
  currentIndex: number;
  numberQuestions: number;
  score: number;
};

const StartQuizz = () => {
  const router = useRouter();
  const questions = UseQUizzStore((state) => state.data);

  if (!questions) {
    router.push("/quizz");
  }

  const [option, setOption] = useState<optionType>({
    value: "",
    id: undefined,
  });

  const [isSubmit, setIsSubmit] = useState(false);
  const [Quizzprogress, SetQuizzProgress] = useState<QuizzProgressType>({
    currentIndex: 0,
    numberQuestions: questions?.length ?? 0,
    score: 0,
  });

  const CurrentQuestion = questions
    ? questions[Quizzprogress.currentIndex]
    : null;

  // start Game
  const onSubmitGame = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (option.id === undefined) {
      // setNotSelectedOption(true);
      return;
    }

    // setNotSelectedOption(false);
    setIsSubmit(true);

    setTimeout(() => {
      if (Quizzprogress.currentIndex <= Quizzprogress.numberQuestions - 1) {
        if (CurrentQuestion?.correctAnswer === option.value) {
          SetQuizzProgress((current) => {
            return {
              ...current,
              score: current.score + 1,
            };
          });
        }
        if (Quizzprogress.currentIndex == Quizzprogress.numberQuestions - 1) {
          // end  Quizz
          router.push("/dashboard");

          return (
            <div className="toast">
              <div className="alert alert-info">
                <span>Terminé.</span>
              </div>
            </div>
          );
        } else {
          // Continue Next Question
          SetQuizzProgress((current) => {
            return {
              ...current,
              currentIndex: current.currentIndex + 1,
            };
          });
        }

        setIsSubmit(false);
        setOption({
          value: "",
          id: undefined,
        });
        router.refresh();
      }
    }, 1000);
  };

  // confeettit

  return (
    <div>
      <div className="border p-4 my-20 text-sm">
        <div>
          <p className="font-bold my-2 justify-end flex gap-4 items-center ">
            <span>
              {Quizzprogress.currentIndex + 1} / {Quizzprogress.numberQuestions}
            </span>
            <span>Score : {Quizzprogress.score}</span>
          </p>
        </div>
        <h3 className="font-bold text-xl my-6">{CurrentQuestion?.question}</h3>

        <QuizzForm
          option={option}
          setOption={setOption}
          isSubmit={isSubmit}
          question={CurrentQuestion}
        />

        {/* actions */}

        <div className="flex gap-3 justify-end items-center">
          <Button variant={"destructive"}>Terminé</Button>
          <Button
            disabled={
              Quizzprogress.currentIndex == Quizzprogress.numberQuestions ||
              option.id === undefined
            }
            variant={"success"}
            onClick={async (e) => {
              onSubmitGame(e);
            }}
          >
            Valider la reponse
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartQuizz;
