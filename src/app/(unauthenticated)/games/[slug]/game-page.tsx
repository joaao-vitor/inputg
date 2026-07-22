import { getGameBySlug } from "@/lib/services/game.service";
import { GameDetails } from "./_components/game-details";
import Image from "next/image";
import { GameAside } from "./_components/game-aside";
import { GameReviews } from "./_components/game-reviews";
import { CreateReviewDialog } from "./_components/create-review/create-review-dialog";
import { getGameStatusByUserAndGame } from "@/lib/services/game-status.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function GamePageWrapper({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  const { slug } = await params;
  const game = await getGameBySlug(slug);
  const defaultGameStatus =
    (session?.user &&
      game?.id &&
      (await getGameStatusByUserAndGame(session?.user.id, game?.id))) ||
    null;

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center relative">
        <div className="w-full h-[70vh] max-h-120 sticky">
          <Image
            src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.screenshotsIds[0]}.jpg`}
            alt={game?.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/60 backdrop-blur-xs"></div>
        </div>
        <div className="flex flex-col container px-4 md:flex-row gap-6 -mt-64 md:-mt-48 z-2">
          <GameAside game={game} />
          <div className="flex flex-col gap-2">
            <GameDetails game={game} />
            <GameReviews gameId={game.id} />
          </div>
        </div>
      </div>
      <CreateReviewDialog game={game} defaultGameStatus={defaultGameStatus} />
    </>
  );
}
