import { string, z } from "zod";
import prisma from "./prisma";

export const QuestionScheme = z.object({
  question: z.string(),
  options: z.string().array(),
  correctAnswer: z.string(),
  explication: z.string().optional(),
});

export type QuizQuestion = z.infer<typeof QuestionScheme>;

export const quizData: QuizQuestion[] = [
  {
    question: "Quand a été fondée la ville de Fès?",
    options: ["VIe siècle", "VIIIe siècle", "Xe siècle", "XIIe siècle"],
    correctAnswer: "VIIIe siècle",
  },
  {
    question: "Quelle est la principale université située à Fès?",
    options: [
      "Université Al Quaraouiyine",
      "Université de Fès",
      "Université Ibn Battuta",
      "Université Mérinide",
    ],
    correctAnswer: "Université Al Quaraouiyine",
  },
  {
    question: "Quel aspect de l'artisanat de Fès est particulièrement réputé?",
    options: ["Travail du bois", "Poterie", "Fabrication de bijoux", "Couture"],
    correctAnswer: "Poterie",
  },
  {
    question: "Quel site de Fès est classé au patrimoine mondial de l'UNESCO?",
    options: [
      "La mosquée Al-Andalusiyyin",
      "Les tombeaux de la dynastie des Mérinides",
      "La porte Bab Boujloud",
      "La médina",
    ],
    correctAnswer: "La médina",
  },
  {
    question: "Quel édifice de Fès est connu comme la 'porte bleue'?",
    options: [
      "Porte Bab Boujloud",
      "Université Al Quaraouiyine",
      "Mosquée Al-Andalusiyyin",
      "Tombeaux des Mérinides",
    ],
    correctAnswer: "Porte Bab Boujloud",
  },
  {
    question: "Quelle année a vu la fondation de l'Université Al Quaraouiyine?",
    options: ["750", "859", "920", "1001"],
    correctAnswer: "859",
  },
  {
    question: "Quel a été le rôle de Fès dans le développement du Maroc?",
    options: [
      "Économique",
      "Culturel",
      "Spirituel",
      "Tous les choix précédents",
    ],
    correctAnswer: "Tous les choix précédents",
  },
  {
    question: "Quel est le charme particulier de Fès selon le texte?",
    options: [
      "Monuments modernes",
      "Universités renommées",
      "Médina labyrinthique",
      "Plages pittoresques",
    ],
    correctAnswer: "Médina labyrinthique",
  },
  {
    question:
      "Quel élément contribue à créer une expérience sensorielle à Fès?",
    options: [
      "Couleurs, parfums et sons des souks",
      "Monuments historiques",
      "Universités renommées",
      "Cuisine moderne",
    ],
    correctAnswer: "Couleurs, parfums et sons des souks",
  },
  {
    question:
      "Quelle caractéristique de Fès est mentionnée comme captivante pour les visiteurs?",
    options: [
      "Musées fascinants",
      "Promenades sur les plages",
      "Universités renommées",
      "Cuisine locale délicieuse",
    ],
    correctAnswer: "Musées fascinants",
  },
];

export const userCountQuizz = async (id: string) => {
  const countUserNumberQuizz = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      usageMax: true,
    },
  });

  return countUserNumberQuizz;
};
