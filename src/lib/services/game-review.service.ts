import prisma from "../prisma";
import { CreateReviewDTO } from "@/schemas/create-review.schema";

export const upsertReview = async ({
  content,
  gameId,
  userId,
  rating,
  gameStatus,
  platformId,
}: CreateReviewDTO) => {
  const [_, review] = await prisma.$transaction([
    prisma.userGame.upsert({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
      update: {
        status: gameStatus,
        rating: rating,
      },
      create: {
        userId,
        gameId,
        status: gameStatus,
        rating: rating,
      },
    }),
    prisma.review.upsert({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
      update: {
        content,
        platformId,
      },
      create: {
        userId,
        gameId,
        content,
        platformId,
      },
    }),
  ]);

  return review;
};
