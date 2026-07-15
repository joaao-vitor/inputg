import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Heart, Star } from "lucide-react";

export const GameCard = () => {
  return (
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
                <span className="text-white font-semibold ml-2">4.5</span>
              </div>
              <div className="flex items-center px-4 py-2 rounded-full bg-black/50 backdrop-blur-md mt-2">
                <Heart className="text-red-500 fill-red-500 w-6 h-6" />
                <span className="text-white font-semibold ml-2">1.2k</span>
              </div>
            </div>
            <h3 className="text-white font-semibold self-center pb-4 text-lg truncate drop-shadow-md">
              Game Title
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
