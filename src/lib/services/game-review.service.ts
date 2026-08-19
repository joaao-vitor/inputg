import { ReviewWithRelationsAndGame } from "@/types/review.types";
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
  const [, review] = await prisma.$transaction([
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
  currentUserId,
}: {
  gameSlug: string;
  take: number;
  cursor?: string;
  currentUserId?: string;
}) => {
  const game = await prisma.game.findUnique({
    where: { slug: gameSlug },
    select: { id: true },
  });

  if (!game) {
    throw new Error("Game not found");
  }

  return getReviewsByGameId({
    gameId: game.id,
    take,
    cursor,
    currentUserId,
  });
};

export const getReviewsByGameId = async ({
  gameId,
  take = 5,
  cursor,
  currentUserId,
}: {
  gameId: string;
  take?: number;
  cursor?: string;
  currentUserId?: string;
}) => {
  const reviews = await prisma.review.findMany({
    take: take + 1,
    cursor: cursor ? { id: cursor } : undefined,
    where: { gameId },
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
          status: true,
          rating: true,
        },
      },
      _count: {
        select: {
          reviewLikes: true,
        },
      },
      reviewLikes: currentUserId
        ? {
            where: { userId: currentUserId },
            select: { userId: true },
          }
        : false,
    },
  });

  let nextCursor: string | undefined;
  if (reviews.length > take) {
    const nextItem = reviews.pop();
    nextCursor = nextItem?.id;
  }

  return { reviews: reviews.map((r) => formatReview(r)), nextCursor };
};

export const getReviewById = async (
  reviewId: string,
  currentUserId?: string,
): Promise<ReviewWithRelationsAndGame | null> => {
  const review = await prisma.review.findUnique({
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
          status: true,
          rating: true,
        },
      },
      _count: {
        select: {
          reviewLikes: true,
        },
      },
      reviewLikes: currentUserId
        ? {
            where: { userId: currentUserId },
            select: { userId: true },
          }
        : false,
    },
  });

  if (!review) return null;
  const { _count, reviewLikes, ...rest } = review;
  return {
    ...rest,
    likesCount: _count?.reviewLikes ?? 0,
    isLiked: Array.isArray(reviewLikes) && reviewLikes.length > 0,
  };
};

export const deleteReviewById = async (reviewId: string, userId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true },
  });

  if (review?.userId !== userId)
    throw new Error("You are not authorized to delete this review");

  return await prisma.review.delete({
    where: { id: reviewId },
    include: {
      game: {
        select: {
          slug: true,
        },
      },
    },
  });
};

export const getPopularReviews = async (
  take: number = 5,
  currentUserId?: string,
): Promise<ReviewWithRelationsAndGame[]> => {
  const baseQueryOptions = {
    orderBy: {
      reviewLikes: {
        _count: "desc" as const,
      },
    },
    take,
    include: {
      game: {
        select: {
          id: true,
          igdbImageId: true,
          name: true,
          slug: true,
          releaseDate: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      userGame: {
        select: {
          rating: true,
          status: true,
        },
      },
      platform: {
        select: {
          name: true,
          slug: true,
        },
      },
      reviewLikes: currentUserId
        ? {
            where: {
              userId: currentUserId,
            },
          }
        : false,
      _count: {
        select: {
          reviewLikes: true,
        },
      },
    },
  };

  let reviews = await prisma.review.findMany({
    ...baseQueryOptions,
    where: {
      updatedAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
      },
    },
  });

  if (reviews.length === 0)
    reviews = await prisma.review.findMany({
      ...baseQueryOptions,
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
        },
      },
    });

  if (reviews.length === 0)
    reviews = await prisma.review.findMany({
      ...baseQueryOptions,
    }); // all time

  return reviews.map((review) => formatReview(review));
};

const formatReview = (review: any) => {
  const { _count, reviewLikes, ...rest } = review;
  return {
    ...rest,
    likesCount: _count?.reviewLikes ?? 0,
    isLiked: Array.isArray(reviewLikes) && reviewLikes.length > 0,
  };
};
