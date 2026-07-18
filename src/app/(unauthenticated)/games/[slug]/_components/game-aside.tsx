import { GameWithRelations } from "@/types/game.types";
import Image from "next/image";

export const GameAside = async ({ game }: { game: GameWithRelations }) => {
  if (!game) return <div>Game not found</div>;
  return (
    <div className="relative aspect-3/4 w-48 shrink-0 rounded-xl overflow-hidden shadow-xl/50 shadow-emerald-900/30  self-center md:self-start">
      <Image
        src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.igdbImageId}.jpg`}
        alt={game?.name}
        fill
        className="object-cover w-full h-full"
      />
    </div>
  );
};
