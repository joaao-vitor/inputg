import { Prisma, UserGame } from "@/generated/prisma/client";

export type GameWithRelations = Prisma.GameGetPayload<{
  include: {
    genres: true;
    platforms: true;
  };
}>;

export type GameWithUserStatus = GameWithRelations & {
  userGameStatus: UserGame | null;
};