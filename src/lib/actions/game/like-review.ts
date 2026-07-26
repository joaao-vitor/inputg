"use server";
import { auth } from "@/lib/auth";
import { likeReview } from "@/lib/services/review-like.service";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const toggleLikeReview = async (reviewId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("User not authenticated");
  }
  const game = await likeReview(reviewId, session.user.id);
  if (game) {
    revalidatePath(`/games/${game.slug}/reviews/${reviewId}`);
  }
};
