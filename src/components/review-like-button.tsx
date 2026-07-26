import { getReviewLikesCountAndOrStatus } from "@/lib/services/review-like.service";
import { ReviewLikeButtonClient } from "./review-like-button-client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const ReviewLikeButton = async ({ reviewId }: { reviewId: string }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const reviewLikes = await getReviewLikesCountAndOrStatus(
    reviewId,
    session?.user?.id,
  );
  return (
    <ReviewLikeButtonClient
      reviewId={reviewId}
      initialIsLiked={reviewLikes.isLiked}
      initialLikeCount={reviewLikes.likeCount}
      isLoggedIn={!!session?.user}
    />
  );
};
