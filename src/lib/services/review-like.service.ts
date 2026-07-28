import prisma from "../prisma";

export const likeReview = async (reviewId: string, userId: string) => {
  const review = await prisma.$transaction(async (tx) => {
    const existingLike = await tx.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    });

    if (existingLike) {
      await tx.reviewLike.delete({
        where: {
          userId_reviewId: {
            userId,
            reviewId,
          },
        },
      });
    } else {
      await tx.reviewLike.create({
        data: {
          userId,
          reviewId,
        },
      });
    }
    return await tx.review.findUnique({
      where: { id: reviewId },
      include: {
        _count: {
          select: {
            reviewLikes: true,
          },
        },
        reviewLikes: {
          where: { userId },
          select: { userId: true },
        },
        game: {
          select: {
            slug: true,
          },
        },
      },
    });
  });

  return {
    isLiked: review?.reviewLikes && review?.reviewLikes.length > 0,
    likeCount: review?._count.reviewLikes ?? 0,
    gameSlug: review?.game?.slug ?? null,
  };
};

export const getReviewLikesCountAndOrStatus = async (
  reviewId: string,
  userId?: string,
) => {
  const likeCount = await prisma.reviewLike.count({
    where: {
      reviewId,
    },
  });

  let isLiked = false;
  if (userId) {
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    });
    isLiked = !!existingLike;
  }

  return {
    likeCount,
    isLiked,
  };
};
