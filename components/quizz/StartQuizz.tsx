"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { UseQUizzStore } from "@/src/zustand/store";
import { Accordion, AccordionContent, AccordionTrigger } from "../ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import { QuizzOptionsForm, optionType } from "./QuizzOptionsForm";

export type QuizzProgressType = {
  currentIndex: number;
  numberQuestions: number;
  score: number;
};

const StartQuizz = () => {
  const router = useRouter();
  const updateQuizData = UseQUizzStore((state) => state.updateQuizzData);
  const dataLocalStorage = localStorage.getItem("responseDataAi");

  if (dataLocalStorage) {
    updateQuizData(JSON.parse(dataLocalStorage));
  }

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
      return;
    }

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

        <QuizzOptionsForm
          option={option}
          setOption={setOption}
          isSubmit={isSubmit}
          question={CurrentQuestion}
        />

        <p className="my-4 px-6 italic">
          <DetailsQuestion
            content={CurrentQuestion?.correctAnswer ?? ""}
            detail={CurrentQuestion?.explication}
          />
        </p>
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

const DetailsQuestion = ({
  title = "Voir la solution et les details",
  content,
  detail,
}: {
  title?: string;
  content: string;
  detail?: string;
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          <p className="my-2">
            <span className="font-bold text-base">Solution : </span>
            {content}
          </p>
          <p className="text-sm">
            <span className="font-bold text-base">Details :</span> {detail}
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
