import { GameCard } from "@/components/game-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, Star } from "lucide-react";
import Image from "next/image";

export const PopularGames = () => {
  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold border-b-2 inline border-primary pb-1 pr-5">
        <span className="text-primary">popular</span> games
      </h2>
      <p className="text-muted-foreground mt-2">
        Here are some of the most popular games!
      </p>
      <div className="mt-4">
        <Carousel
          opts={{
            align: "center",
          }}
          className="w-full"
        >
          <CarouselContent className="relative gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 md:basis-1/4 lg:basis-1/7"
              >
                <GameCard />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className={"ml-4 absolute left-0"} />
          <CarouselNext className={"mr-4 absolute right-0"} />
        </Carousel>
      </div>
    </section>
  );
};
