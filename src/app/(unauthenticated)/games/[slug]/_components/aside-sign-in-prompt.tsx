"use client";

import { useAuthDialogStore } from "@/store/useAuthDialogStore";

export const AsideSignInPrompt = () => {
  const { onOpenChange } = useAuthDialogStore();
  const handleSignIn = () => {
    onOpenChange(true);
  };
  return (
    <div className="p-2 bg-accent/60 text-muted-foreground text-center rounded-lg shadow-lg/50 shadow-primary/20 text-sm">
      <p>
        Please{" "}
        <span
          className="underline underline-offset-2 cursor-pointer hover:text-accent-foreground transition-colors duration-300"
          onClick={handleSignIn}
        >
          sign in
        </span>{" "}
        to rate this game.
      </p>
    </div>
  );
};
