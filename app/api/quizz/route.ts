import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { env } from "@/src/env";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: env.OPENAI_KEY,
    });
    const body = await req.json();
    const bodyParse: ChatCompletionMessageParam = body;

    console.log("aller....");

    const data = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Créez une JSON avec 3 questions pertinentes permettant de reviser tous les sujets du texte en objet de la forme  {question: string;options: string[];correctAnswer: string;explication:string;} (4 options pour chaque question et une correctAnswer) basée sur les informations suivante  :  je veux uniquement les questions. NB:meme pas une texte de ta part: juste les questions . Il ne faut pas oublier je veux un format JSON sans ecrire aucun mot de ta part uniquement le tableau et aussi une explication(detail) de la vrai reponse. Voici le texte donner par le user`,
        },
        bodyParse,
      ],
      temperature: 0.2,
      max_tokens: 1000,
    });

    console.log(data);
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
