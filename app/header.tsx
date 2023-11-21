"use client";

import CenterLayout from "@/components/layout/CenterLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import ButtonTheme from "@/src/theme/ButtonTheme";
import Link from "next/link";
import React from "react";

import { signIn } from "next-auth/react";
import AvatarProfile from "@/components/ui/AvatarProfile";
import { Gem } from "lucide-react";
import LoginButton from "@/components/auth/LoginButton";

const Header = ({
  userId,
  userName,
  userImage,
  countUsage,
}: {
  userId?: string;
  userImage?: string | undefined | null;
  userName?: string | undefined | null;
  countUsage?: number;
}) => {
  return (
    <div>
      <CenterLayout className="flex justify-between items-center  max-md:text-xs">
        <Link
          href="/"
          className="text-xl max-md:text-sm font-extrabold text-purple-700 flex items-center"
        >
          <div className="rounded-full h-12 w-12 max-md:w-8 max-md:h-8 flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-500 text-white mr-1">
            <i className="fas fa-cogs">Re</i>
          </div>
          <div className="italic text-gray-700 dark:text-gray-200">vise</div>
        </Link>

        <nav className="flex gap-3 max-md:gap-2 max-md:text-xs">
          <Link
            className={cn(buttonVariants({ variant: "link" }))}
            href={"/dashboard"}
          >
            Commencer
          </Link>
          <Link
            className={cn(buttonVariants({ variant: "link" }), "max-md:w-16")}
            href={"/"}
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4 max-md:gap-1  max-md:text-xs">
          {userId && (
            <p
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "cursor-default"
              )}
            >
              <Gem className="max-md:w-6" /> <span>{countUsage ?? 0}</span>
            </p>
          )}

          <ButtonTheme />
          {userId ? (
            <div className="flex  gap-2 items-center">
              <AvatarProfile name={userName} image={userImage} />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </CenterLayout>
      <Separator />
    </div>
  );
};

export default Header;
