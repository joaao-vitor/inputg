import prisma from "../prisma";

export const likeGame = async (userId: string, gameId: string) => {
  const game = await prisma.$transaction(async (p) => {
    const existingLike = await p.gameLike.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    if (existingLike) {
      await p.gameLike.delete({
        where: {
          userId_gameId: {
            userId,
            gameId,
          },
        },
      });
    } else {
      await p.gameLike.create({
        data: {
          userId,
          gameId,
        },
      });
    }
    return await p.game.findUnique({
      where: { id: gameId },
      select: {
        slug: true,
      },
    });
  });
  return game;
};

export const getGameLikesCountAndOrStatus = async (
  gameId: string,
  userId?: string,
) => {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: {
      _count: {
        select: {
          gameLikes: true,
        },
      },
      gameLikes: userId
        ? {
            where: {
              userId,
            },
          }
        : false,
    },
  });
  return {
    likeCount: game?._count.gameLikes || 0,
    isLiked: (game?.gameLikes && game?.gameLikes.length > 0) || false,
  };
};
