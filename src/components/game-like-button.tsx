import { getGameLikesCountAndOrStatus } from "@/lib/services/game-like.service";
import { GameLikeButtonClient } from "./game-like-button-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const GameLikeButton = async ({ gameId }: { gameId: string }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const gameLikes = await getGameLikesCountAndOrStatus(
    gameId,
    session?.user?.id,
  );
  return (
    <GameLikeButtonClient
      gameId={gameId}
      initialIsLiked={gameLikes.isLiked}
      initialLikeCount={gameLikes.likeCount}
      isLoggedIn={!!session?.user}
    />
  );
};
