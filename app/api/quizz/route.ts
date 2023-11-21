import { QuestionScheme } from "@/lib/data";
import prisma from "@/lib/prisma";
import { z } from "zod";

const bodyScheme = QuestionScheme.array();

export async function POST(request: Request) {
  const body = await request.json();
  const bodyParse = bodyScheme.parse(body);
}
