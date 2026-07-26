"use client";

import { toggleLikeReview } from "@/lib/actions/game/like-review";
import { startTransition, useOptimistic, useRef } from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export const ReviewLikeButtonClient = ({
  reviewId,
  initialIsLiked,
  initialLikeCount,
  isLoggedIn,
}: {
  reviewId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
  isLoggedIn: boolean;
}) => {
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    { isLiked: initialIsLiked, likeCount: initialLikeCount },
    (currentState) => {
      if (currentState.isLiked) {
        return {
          ...currentState,
          isLiked: false,
          likeCount: currentState.likeCount - 1,
        };
      } else {
        return {
          ...currentState,
          isLiked: true,
          likeCount: currentState.likeCount + 1,
        };
      }
    },
  );
  const isExecuting = useRef(false);
  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn || isExecuting.current) return;
    isExecuting.current = true;
    startTransition(async () => {
      setOptimisticLikes(null);
      try {
        await toggleLikeReview(reviewId);
      } catch (error) {
      } finally {
        isExecuting.current = false;
      }
    });
  };

  return (
    <div className="text-sm flex items-center gap-2">
      <Button
        variant={"link"}
        className={"text-muted-foreground font-semibold px-0"}
        size={"sm"}
        onClick={handleLike}
      >
        <Heart
          className={cn({
            "fill-red-500 text-red-500": optimisticLikes.isLiked,
          })}
        />
        like review
      </Button>
      <span className="text-muted-foreground/50">
        {optimisticLikes.likeCount} likes
      </span>
    </div>
  );
};
