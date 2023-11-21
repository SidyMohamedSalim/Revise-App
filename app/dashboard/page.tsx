import { Card, ReviewsCard } from "@/components/dashboard/Card";
import CenterLayout from "@/components/layout/CenterLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/authConfig";
import { userCountQuizz } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await getAuthSession();

  if (!session) {
    return redirect("/");
  }
  const countUserGameQuizz = await userCountQuizz(session.user.id ?? "");
  return (
    <div>
      <CenterLayout>
        <div>
          <Link
            href={"/quizz"}
            className={cn(buttonVariants(), "my-8 self-end")}
          >
            Generer un examen
          </Link>
        </div>

        {/* card stats */}
        <div className="grid grid-cols-2 gap-8">
          <Card
            title="Utilisations"
            value={countUserGameQuizz?.usageMax ?? 0}
            type="usage"
          />
          <Card title="Historiques" value={1600} type="old" />
        </div>

        {/* card reviews */}
        <ReviewsCard />
      </CenterLayout>
    </div>
  );
};

export default page;
