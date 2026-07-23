"use server";

import { getReviewsByGameSlug } from "../services/game-review.service";

export const fetchReviewsByGameSlug = async ({
  gameSlug,
  take = 5,
  cursor,
}: {
  gameSlug: string;
  take: number;
  cursor?: string;
}) => {
  const response = await getReviewsByGameSlug({ gameSlug, take, cursor });
  return response;
};
