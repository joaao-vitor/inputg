"use server";

import { auth } from "@/lib/auth";
import { likeGame } from "@/lib/services/game-like.service";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

export const toggleLike = async (gameId: string) => {
    console.log("toggleLike called with gameId:", gameId);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id;

  const game = await likeGame(userId, gameId);

  if (game?.slug) {
    revalidateTag(`game-${game.slug}`, "max");
    revalidatePath(`/games/${game.slug}`);
  }
};
