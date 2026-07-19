import { GameStatus } from "@/generated/prisma/enums";
import prisma from "../prisma";

export const upsertGameStatus = async (
  userId: string,
  gameId: string,
  status: GameStatus,
) => {
  await prisma.userGame.upsert({
    where: {
      userId_gameId: {
        userId: userId,
        gameId: gameId,
      },
    },
    create: {
      userId: userId,
      gameId: gameId,
      status: status,
    },
    update: {
      status: status,
    },
  });
};

export const getGameStatusByUserAndGame = async (
  userId: string,
  gameId: string,
) => {
  return await prisma.userGame.findUnique({
    where: {
      userId_gameId: {
        userId: userId,
        gameId: gameId,
      },
    },
  });
};
