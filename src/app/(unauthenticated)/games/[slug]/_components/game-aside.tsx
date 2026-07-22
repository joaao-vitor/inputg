import { GameWithRelations } from "@/types/game.types";
import Image from "next/image";
import { SelectGameStatus } from "./select-status";
import { getGameStatusByUserAndGame } from "@/lib/services/game-status.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GameRating } from "./game-rating";
import { AsideSignInPrompt } from "./aside-sign-in-prompt";

export const GameAside = async ({ game }: { game: GameWithRelations }) => {
  if (!game) return <div>Game not found</div>;

  const session = await auth.api.getSession({ headers: await headers() });

  const defaultGameStatus = session?.user
    ? await getGameStatusByUserAndGame(session.user.id, game.id)
    : null;

  return (
    <aside className="lg:sticky top-0 flex flex-col lg:self-start justify-self-center">
      <div className="flex w-48 flex-col self-center md:self-start">
        <div className="relative aspect-3/4 w-full shrink-0 overflow-hidden rounded-xl shadow-xl/50 shadow-emerald-900/30">
          <Image
            src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.igdbImageId}.jpg`}
            alt={game?.name}
            fill
            className="h-full w-full object-cover"
          />
        </div>

        {session?.user ? (
          <div className="flex w-full flex-col gap-4 pt-6">
            <SelectGameStatus
              gameId={game.id}
              defaultStatus={defaultGameStatus?.status}
              isAuthenticated={!!session?.user}
            />
            <GameRating
              gameId={game.id}
              defaultRating={defaultGameStatus?.rating || 0}
            />
          </div>
        ) : (
          <div className="w-full pt-6">
            <AsideSignInPrompt />
          </div>
        )}
      </div>
    </aside>
  );
};
