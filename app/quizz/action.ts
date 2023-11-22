// "use server";

// import { getAuthSession } from "@/lib/authConfig";
// import prisma from "@/lib/prisma";

// export const updateBilling = async (formData: FormData) => {
//   const session = await getAuthSession();

//   if (!session) {
//     throw new Error("Impossible");
//   }
//   await prisma.user.update({
//     where: {
//       id: session.user.id,
//     },
//     data: {
//       usageMax: 100,
//     },
//   });
// };
