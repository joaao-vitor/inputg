"use client";
import { Button } from "@/components/ui/button";
import { SignTypes, useAuthDialogStore } from "@/store/useAuthDialogStore";
import Image from "next/image";

export const Hero = () => {
  const { openDialog, onSignTypeChange } = useAuthDialogStore();

  return (
    <section className="relative w-full max-h-[85vh] sm:max-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/hero.png"
          alt="Gaming Background"
          fill
          priority
          className="object-cover opacity-25 select-none"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/80 to-background/70" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-background/90" />
      </div>

      <div className="container relative px-4 py-12 md:py-24 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl flex flex-col gap-4 md:gap-6 items-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-extrabold tracking-tighter leading-tighter uppercase">
            Track the games you&apos;ve played <br />
            Save your{" "}
            <span className="text-emerald-500 font-black">game life</span> here
            <span className="sm:inline">
              <br /> Was it a good game?
            </span>
          </h1>

          <p className="text-sm md:text-lg text-muted-foreground font-sans tracking-normal px-2">
            Share your thoughts and reviews with the community.
          </p>

          <div className="mt-4 w-full sm:w-auto px-4 sm:px-0">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-13 px-8 text-base font-semibold cursor-pointer"
              onClick={() => {
                onSignTypeChange(SignTypes.SIGNUP);
                openDialog();
              }}
            >
              Get Started now!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
