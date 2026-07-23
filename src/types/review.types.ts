import { Prisma } from "@/generated/prisma/client";

export type ReviewWithRelations = Prisma.ReviewGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        username: true;
        image: true;
      };
    };
    platform: {
      select: {
        id: true;
        name: true;
      };
    };
    userGame: {
      select: {
        liked: true;
        status: true;
        rating: true;
      };
    };
  };
}>;

export type ReviewWithRelationsAndGame = ReviewWithRelations & {
  game: {
    id: string;
    name: string;
    igdbImageId: string | null;
    slug: string;
    screenshotsIds: string[];
    igdbId: number | null;
    releaseDate: Date | null;
  };
};
