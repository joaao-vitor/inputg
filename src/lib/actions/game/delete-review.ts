"use server";
import { headers } from "next/headers";
import { auth } from "../../auth";
import { deleteReviewById } from "../../services/game-review.service";

export const deleteReview = async (reviewId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await deleteReviewById(reviewId, session.user.id);
};
