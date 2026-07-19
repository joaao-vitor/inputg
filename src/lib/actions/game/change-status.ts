"use server";

import { GameStatus } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { upsertGameStatus } from "@/lib/services/game-status.service";
import { headers } from "next/headers";

export const changeGameStatus = async (gameId: string, status: GameStatus) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  upsertGameStatus(session.user.id, gameId, status);
};
