"use client";

import React, { FormEvent, useState } from "react";
import { TextArea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChatCompletionMessageParam } from "openai/resources";
import OpenAI from "openai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizQuestion, quizData } from "@/lib/data";
import { useRouter } from "next/navigation";
import { UseQUizzStore } from "@/src/zustand/store";
import clsx from "clsx";
import { decrementNumberAction } from "@/app/actions/quizz.action";
import { env } from "@/src/env";

const TextForm = ({ countMax }: { countMax: number }) => {
  const maxLength = 6000;
  const [textAreaCount, setTextAreaCount] = useState(0);
  const updateQuizzData = UseQUizzStore((state) => state.updateQuizzData);
  const queryClient = useQueryClient();
  const router = useRouter();
  const openai = new OpenAI({
    apiKey: env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const mutation = useMutation({
    mutationFn: ({ TexteUser }: { TexteUser: ChatCompletionMessageParam }) =>
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [TexteUser],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    onSettled: async () => {
      queryClient.cancelQueries();
      const data = mutation.data?.choices[0].message.content;
      if (data) {
        const parseData: QuizQuestion[] = JSON.parse(data);
        updateQuizzData(parseData);
      }
      router.refresh();
    },

    onError: () => {},
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const user = String(formData.get("user"));

    const TexteUser = {
      role: "user",
      content: `Créez une JSON avec 2 questions pertinentes permettant de reviser tous les sujets du texte en objet de la forme  {question: string;options: string[];correctAnswer: string;explication:string;} (4 options pour chaque question et une correctAnswer) basée sur les informations suivante  :  je veux uniquement les questions. NB:meme pas une texte de ta part: juste les questions . Il ne faut pas oublier je veux un format JSON sans ecrire aucun mot de ta part uniquement le tableau et aussi une explication(detail) de la vrai reponse. Voici le texte : ${user}`,
    } satisfies ChatCompletionMessageParam;

    if (countMax > 0) {
      await mutation.mutate({ TexteUser });
    }
  };

  if (mutation.status === "success") {
    const data = mutation.data?.choices[0].message.content;
    if (data) {
      updateQuizzData(JSON.parse(data));

      router.push("/quizz/game");
    }
  }

  return (
    <form
      onSubmit={async (e) => {
        await handleSubmit(e).then(async () => {
          await decrementNumberAction();
        });
      }}
    >
      <h3 className="py-4 font-bold text-lg">
        Generer un examen à partir d&apos;un texte donné
      </h3>

      {countMax <= 0 && !mutation.isPending && (
        <p className="text-red-500 font-bold">
          Les nombres de possiblités sont terminés !!
        </p>
      )}

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
            mutation.isPending || textAreaCount > maxLength || countMax <= 0
          }
          className="bg-green-500"
          type="submit"
        >
          {mutation.isPending ? <p>Creation...</p> : "Generer"}
        </Button>
      </fieldset>
    </form>
  );
};

export default TextForm;
