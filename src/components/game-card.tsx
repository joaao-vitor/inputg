import { Card, CardContent } from "@/components/ui/card";
import {
  GameFromIGDB,
  GameWithRelations,
  PopularGameSummary,
} from "@/types/game.types";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const GameCard = ({
  game,
}: {
  game: GameFromIGDB | GameWithRelations | PopularGameSummary;
}) => {
  const imageId =
    "cover" in game
      ? game.cover?.image_id
      : "igdbImageId" in game
        ? game.igdbImageId
        : undefined;

  return (
    <Link href={`/games/${game.slug}`}>
      <Card className="gap-0 py-0 overflow-hidden">
        <CardContent className="flex aspect-3/4 group relative overflow-hidden">
          <Image
            src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${imageId || "default"}.jpg`}
            alt={`${game.name} cover art`}
            fill={true}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="bg-linear-to-t from-black/90 via-black/50 to-transparent backdrop-blur-xs absolute bottom-0 left-0 right-0 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col p-4 h-full">
              {"averageRating" in game && (
                <div className="grow flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center px-4 py-2 rounded-full bg-black/50 backdrop-blur-md">
                    <Star className="text-amber-400 fill-amber-400 w-6 h-6" />
                    <span className="text-white font-semibold ml-2">{game.averageRatingAllTime}</span>
                  </div>
                  <div className="flex items-center px-4 py-2 rounded-full bg-black/50 backdrop-blur-md mt-2">
                    <Heart className="text-red-500 fill-red-500 w-6 h-6" />
                    <span className="text-white font-semibold ml-2">{game.totalLikesAllTime}</span>
                  </div>
                </div>
              )}
              <h3 className="text-white font-semibold self-center pb-4 text-lg text-center drop-shadow-md mt-auto line-clamp-3">
                {game.name}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
