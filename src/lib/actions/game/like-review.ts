"use server";
import { auth } from "@/lib/auth";
import { likeReview } from "@/lib/services/review-like.service";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const toggleLikeReview = async (reviewId: string, pathname?: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("User not authenticated");
  }
  const { likeCount, gameSlug, isLiked } = await likeReview(
    reviewId,
    session.user.id,
  );

  revalidatePath(`/games/${gameSlug}`, "layout");
  revalidatePath(pathname || `/games/${gameSlug}`, "layout");
  return { isLiked, likeCount };
};
