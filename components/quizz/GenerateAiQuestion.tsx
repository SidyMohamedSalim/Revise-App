"use client";

import React, { FormEvent, useState } from "react";
import { TextArea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChatCompletionMessageParam } from "openai/resources";
import { useMutation } from "@tanstack/react-query";
import { QuizQuestion } from "@/lib/data";
import { useRouter } from "next/navigation";
import { UseQUizzStore } from "@/src/zustand/store";
import clsx from "clsx";
import { decrementNumberAction } from "@/app/actions/quizz.action";

const GenerateAiQuestions = ({ countMax }: { countMax: number }) => {
  const maxLength = 6000;
  const [textAreaCount, setTextAreaCount] = useState(0);

  const updateQuizzData = UseQUizzStore((state) => state.updateQuizzData);
  const router = useRouter();

  const GenereQuestionsWithAi = useMutation({
    mutationFn: ({ data }: { data: ChatCompletionMessageParam }) => {
      return fetch("/api/quizz/", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.json());
    },
    onSuccess: async (response) => {
      const data = response.choices[0].message.content;
      if (data) {
        const parseData: QuizQuestion[] = JSON.parse(data);
        updateQuizzData(parseData);
      }
      router.refresh();
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const user = String(formData.get("user"));

    const data = {
      role: "user",
      content: `${user}`,
    } satisfies ChatCompletionMessageParam;

    if (countMax > 0) {
      await GenereQuestionsWithAi.mutate({ data });
    }
  };

  if (GenereQuestionsWithAi.status === "success") {
    const data = GenereQuestionsWithAi.data?.choices[0].message.content;
    if (data) {
      updateQuizzData(JSON.parse(data));
      router.push("/quizz/game");
    }
  }

  return (
    <form
      onSubmit={async (e) => {
        await handleSubmit(e).then(async () => {
          // await decrementNumberAction();s
        });
      }}
    >
      <h3 className="py-4 font-bold text-lg">
        Generer un examen à partir d&apos;un texte donné
      </h3>

      {countMax <= 0 && !GenereQuestionsWithAi.isPending && (
        <p className="text-red-500 font-bold">
          Les nombres de possiblités sont terminés !!
        </p>
      )}

      {GenereQuestionsWithAi.isPending ? (
        <div className="w-full flex justify-center items-center h-36">
          <div className="flex flex-col justify-center items-center">
            <p>Le systeme est entrain de generer...</p>
            <span className="loading loading-infinity loading-lg"></span>
          </div>
        </div>
      ) : (
        <fieldset name="user" className="flex items-end gap-2 flex-col ">
          <div className="w-full">
            <TextArea
              disabled={countMax <= 0}
              max={maxLength}
              count={textAreaCount}
              onChange={(e) => {
                e.preventDefault();
                setTextAreaCount(e.currentTarget.value.length);
              }}
              name="user"
              label="Entrez le texte"
            />
            <p
              className={clsx("text-end my-4", {
                "text-red-400": textAreaCount > maxLength,
              })}
            >
              {textAreaCount} / {maxLength}
            </p>
          </div>
          <Button
            disabled={textAreaCount > maxLength || countMax <= 0}
            className="bg-green-500"
            type="submit"
          >
            Generer
          </Button>
        </fieldset>
      )}
    </form>
  );
};

export default GenerateAiQuestions;
