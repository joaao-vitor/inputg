import { Prisma } from "@/generated/prisma/client";

export type GameWithRelations = Prisma.GameGetPayload<{
  include: {
    genres: true;
    platforms: true;
  };
}>;
