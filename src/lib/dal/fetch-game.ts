"use server";
import { headers } from "next/headers";
import { getGameStatusByUserAndGame } from "../services/game-status.service";
import { getGameBySlug, getGamesFromIGDB } from "../services/game.service";
import { auth } from "../auth";
import { GameWithUserStatus } from "@/types/game.types";

export const fetchGames = async (
  search?: string,
  take: number = 5,
  cursor?: string,
  platforms?: number[],
  genres?: number[],
) => {
  const games = await getGamesFromIGDB(search, take, cursor, platforms, genres);
  return games;
};

export const fetchGameAsUser = async (
  gameSlug: string,
): Promise<GameWithUserStatus | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const game = await getGameBySlug(gameSlug);
  if (!game) return null;

  const userGameStatus = await getGameStatusByUserAndGame(
    session.user.id,
    game.id,
  );
  return { ...game, userGameStatus };
};

export const fetchPopularGames = async (take: number = 10) => {
  const games = await getGamesFromIGDB(undefined, take);
  return games;
};
