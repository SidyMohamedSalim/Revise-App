"use client";

import React, { FormEvent, useState } from "react";
import { TextArea } from "../ui/textarea";
import { Button, buttonVariants } from "../ui/button";
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources";
import { useMutation } from "@tanstack/react-query";
import { QuizQuestion } from "@/lib/data";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { decrementNumberAction } from "@/app/actions/quizz.action";
import { UseQUizzStore } from "@/src/zustand/store";
import { client } from "@/lib/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

const GenerateAiQuestions = ({ countMax }: { countMax: number }) => {
  const maxLength = 6000;
  const [textAreaCount, setTextAreaCount] = useState(0);

  const router = useRouter();

  const GenerateQuestionsWithAi = useMutation({
    mutationFn: async ({ data }: { data: ChatCompletionMessageParam }) => {
      return await client<ChatCompletion>("/api/quizz/", {
        method: "POST",
        data,
      });
    },
    onSuccess(data, variables, context) {
      const el = data.choices[0].message.content;
      if (el) {
        console.log(data);
        const parseData: QuizQuestion[] = JSON.parse(el);
        localStorage.setItem("responseDataAi", JSON.stringify(parseData));
      }
      router.refresh();
    },
    onError(error, variables, context) {
      console.log("Something wrong");
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const textValue = String(formData.get("user"));

    const data: ChatCompletionMessageParam = {
      role: "user",
      content: textValue,
    };

    if (countMax > 0) {
      GenerateQuestionsWithAi.mutate({ data });
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        await handleSubmit(e).then(async () => {
          await decrementNumberAction();
        });
      }}
    >
      <h3 className="py-4 font-bold text-lg">
        Générer un examen à partir d&apos;un texte donné
      </h3>

      {countMax <= 0 && !GenerateQuestionsWithAi.isPending && (
        <p className="text-red-500 font-bold">
          Les possibilités sont épuisées !!
        </p>
      )}

      {GenerateQuestionsWithAi.isSuccess ? (
        <div className="w-full flex justify-center items-center h-36">
          <div className="flex flex-col justify-center items-center">
            <p className="text-green-500">Terminé</p>
            <Link
              href={"/quizz/game"}
              className={cn(buttonVariants({ variant: "success" }))}
            >
              Commencer
            </Link>
          </div>
        </div>
      ) : GenerateQuestionsWithAi.isPending ? (
        <div className="w-full flex justify-center items-center h-36">
          <div className="flex flex-col justify-center items-center">
            <p>Le système est en train de générer...</p>
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
            disabled={
              textAreaCount > maxLength || countMax <= 0 || textAreaCount < 20
            }
            className="bg-green-500"
            type="submit"
          >
            Générer
          </Button>
        </fieldset>
      )}
    </form>
  );
};

export default GenerateAiQuestions;
