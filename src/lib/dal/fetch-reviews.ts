"use server";
import { headers } from "next/headers";
import {
  getPopularReviews,
  getReviewById,
  getReviewsByGameId,
  getReviewsByGameSlug,
} from "../services/game-review.service";
import { auth } from "../auth";

export const fetchReviewsByGameSlug = async ({
  gameSlug,
  take = 5,
  cursor,
}: {
  gameSlug: string;
  take: number;
  cursor?: string;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const response = await getReviewsByGameSlug({
    gameSlug,
    take,
    cursor,
    currentUserId: session?.user?.id,
  });
  return response;
};

export const fetchReviewsByGameId = async ({
  gameId,
  take = 5,
  cursor,
}: {
  gameId: string;
  take: number;
  cursor?: string;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const response = await getReviewsByGameId({
    gameId,
    take,
    cursor,
    currentUserId: session?.user?.id,
  });
  return response;
};

export const fetchReviewById = async ({ reviewId }: { reviewId: string }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  const response = await getReviewById(reviewId, session?.user?.id);
  return response;
};

export const fetchPopularReviews = async ({ take = 5 }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const reviews = await getPopularReviews(take, session?.user?.id);
  return reviews;
};
