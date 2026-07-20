"use server";

import { GameStatus } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import {
  upsertGameRating,
  upsertGameStatus,
} from "@/lib/services/game-status.service";
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

export const changeGameRating = async (
  gameId: string,
  rating: number | null,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  if (rating && (rating < 0 || rating > 5)) {
    throw new Error("Rating must be between 0 and 5");
  }

  upsertGameRating(session.user.id, gameId, rating);
};
