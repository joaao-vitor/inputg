import { Button } from "@/components/ui/button";
import { GameWithRelations } from "@/types/game.types";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import { SelectGameStatus } from "./select-status";
import { getGameStatusByUserAndGame } from "@/lib/services/game-status.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";

export const GameAside = async ({ game }: { game: GameWithRelations }) => {
  if (!game) return <div>Game not found</div>;

  const session = await auth.api.getSession({ headers: await headers() });

  const defaultGameStatus = session?.user
    ? await getGameStatusByUserAndGame(session.user.id, game.id)
    : null;

  return (
    <aside className="lg:sticky top-0 flex flex-col gap-6 lg:self-start justify-self-center">
      <div className="relative aspect-3/4 w-48 shrink-0 rounded-xl overflow-hidden shadow-xl/50 shadow-emerald-900/30  self-center md:self-start">
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.igdbImageId}.jpg`}
          alt={game?.name}
          fill
          className="object-cover w-full h-full"
        />
      </div>
      <div className="w-full pt-6 flex flex-col gap-4">
        <SelectGameStatus
          gameId={game.id}
          defaultStatus={defaultGameStatus?.status}
          isAuthenticated={!!session?.user}
        />
      </div>
    </aside>
  );
};
