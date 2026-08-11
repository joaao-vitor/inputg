"use server";
import { headers } from "next/headers";
import { auth } from "../../auth";
import { deleteReviewById } from "../../services/game-review.service";
import { revalidatePath } from "next/cache";

export const deleteReview = async (reviewId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const review = await deleteReviewById(reviewId, session.user.id);
  revalidatePath(`/games/${review.game.slug}`, "layout");
  return review;
};
