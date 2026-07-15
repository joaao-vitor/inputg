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
              <CarouselItem key={index} className="basis-1/2 md:basis-1/4 lg:basis-1/7">
                <Card className="gap-0 py-0">
                  <CardContent className="flex aspect-3/4 group relative">
                    <Image
                      src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1r5o.jpg`}
                      alt="Game Cover"
                      fill={true}
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="bg-linear-to-t from-black/90 via-black/50 to-transparent backdrop-blur-xs absolute bottom-0 left-0 right-0 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-col p-4 h-full">
                        <div className="grow flex flex-col items-center justify-center gap-2">
                          <div className="flex items-center px-4 py-2 rounded-full bg-black/50 backdrop-blur-md">
                            <Star className="text-amber-400 fill-amber-400 w-6 h-6" />
                            <span className="text-white font-semibold ml-2">
                              4.5
                            </span>
                          </div>
                          <div className="flex items-center px-4 py-2 rounded-full bg-black/50 backdrop-blur-md mt-2">
                            <Heart className="text-red-500 fill-red-500 w-6 h-6" />
                            <span className="text-white font-semibold ml-2">
                              1.2k
                            </span>
                          </div>
                        </div>
                        <h3 className="text-white font-semibold self-center pb-4 text-lg truncate drop-shadow-md">
                          Game Title
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
