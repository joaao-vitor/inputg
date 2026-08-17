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

export type GameFromIGDB = {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  cover?: {
    url: string;
    image_id: string;
  };
  game_type?: string;
  version_parent?: {
    id: number;
  };
  platforms?: {
    id: number;
    name: string;
    slug: string;
  }[];
  genres?: {
    id: number;
    name: string;
    slug: string;
  }[];
  screenshots?: {
    id: number;
    image_id: string;
  }[];
};

export type PopularGameSummary = {
  id: number;
  name: string;
  slug: string;
  igdbImageId: string;
  averageRating: number;
  averageRatingAllTime: number;
  totalRatingsAllTime: number;
  totalLikesAllTime: number;
  totalRatings : number;
  totalLikes: number;
  trendingScore: number;
};