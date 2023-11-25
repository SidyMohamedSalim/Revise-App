import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

export const openai = new OpenAI({
  apiKey: "hello",
  dangerouslyAllowBrowser: true,
});

export const genereDataAiQuery = async ({
  TexteUser,
}: {
  TexteUser: ChatCompletionMessageParam;
}) => {
  return openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `Créez une JSON avec 3 questions pertinentes permettant de reviser tous les sujets du texte en objet de la forme  {question: string;options: string[];correctAnswer: string;explication:string;} (4 options pour chaque question et une correctAnswer) basée sur les informations suivante  :  je veux uniquement les questions. NB:meme pas une texte de ta part: juste les questions . Il ne faut pas oublier je veux un format JSON sans ecrire aucun mot de ta part uniquement le tableau et aussi une explication(detail) de la vrai reponse. Voici le texte donner par le user`,
      },
      TexteUser,
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });
};
