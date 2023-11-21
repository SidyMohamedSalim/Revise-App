import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import clsx from "clsx";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import SocialAuthButton from "./SociaAuth";

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger className={clsx(buttonVariants())}>
        Commencer
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          {/* logo */}
          <p className="text-xl max-md:text-sm font-extrabold text-purple-700 flex items-center">
            <div className="rounded-full h-12 w-12 max-md:w-8 max-md:h-8 flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-500 text-white mr-1">
              <i className="fas fa-cogs">Re</i>
            </div>
            <div className="italic text-gray-700 dark:text-gray-200">vise</div>
          </p>
          <DialogTitle className="py-4 font-light">
            Quel plaisir de vous <br /> revoir !
          </DialogTitle>
          <SocialAuthButton />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
