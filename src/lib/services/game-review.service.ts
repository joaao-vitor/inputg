import {
  ReviewWithRelations,
  ReviewWithRelationsAndGame,
} from "@/types/review.types";
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

export const getReviewsByGameSlug = async ({
  gameSlug,
  take,
  cursor,
}: {
  gameSlug: string;
  take: number;
  cursor?: string;
}) => {
  const gameId = await prisma.game.findUnique({
    where: {
      slug: gameSlug,
    },
    select: {
      id: true,
    },
  });
  if (!gameId) {
    throw new Error("Game not found");
  }
  return getReviewsByGameId({ gameId: gameId?.id || "", take, cursor });
};

export const getReviewsByGameId = async ({
  gameId,
  take = 5,
  cursor,
}: {
  gameId: string;
  take?: number;
  cursor?: string;
}): Promise<{
  reviews: ReviewWithRelations[];
  nextCursor?: string;
}> => {
  const reviews = await prisma.review.findMany({
    take: take + 1,
    cursor: cursor ? { id: cursor } : undefined,
    where: {
      gameId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      platform: {
        select: {
          id: true,
          name: true,
        },
      },
      userGame: {
        select: {
          liked: true,
          status: true,
          rating: true,
        },
      },
    },
  });

  let nextCursor: string | undefined;
  if (reviews.length > take) {
    const nextItem = reviews.pop();
    nextCursor = nextItem?.id;
  }
  return { reviews, nextCursor };
};

export const getReviewById = async (
  reviewId: string,
): Promise<ReviewWithRelationsAndGame | null> => {
  return prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      game: {
        select: {
          id: true,
          name: true,
          igdbImageId: true,
          slug: true,
          screenshotsIds: true,
          igdbId: true,
          releaseDate: true,
        },
      },
      platform: {
        select: {
          slug: true,
          name: true,
          id: true,
        },
      },
      userGame: {
        select: {
          liked: true,
          status: true,
          rating: true,
        },
      },
    },
  });
};
