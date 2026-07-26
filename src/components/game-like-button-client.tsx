"use client";
import { toggleLike } from "@/lib/actions/game/toggle-like";
import { startTransition, useOptimistic, useRef } from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";

export const GameLikeButtonClient = ({
  gameId,
  initialLikeCount,
  initialIsLiked,
  isLoggedIn,
}: {
  gameId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  isLoggedIn: boolean;
}) => {
  const [optimisticState, setOptimisticState] = useOptimistic(
    {
      isLiked: initialIsLiked,
      likeCount: initialLikeCount,
    },
    (currentState) => {
      return {
        isLiked: !currentState.isLiked,
        likeCount: currentState.isLiked
          ? currentState.likeCount - 1
          : currentState.likeCount + 1,
      };
    },
  );

  const isExecuting = useRef(false);

  const handleLike = () => {
    if (!isLoggedIn || isExecuting.current) return;

    isExecuting.current = true;
    startTransition(async () => {
      setOptimisticState(null);
      try {
        await toggleLike(gameId);
      } catch (error) {
        console.error("Erro ao curtir:", error);
      } finally {
        isExecuting.current = false;
      }
    });
  };

  return (
    <Button
      variant={"link"}
      className={"text-muted-foreground/50 hover:text-muted-foreground "}
      onClick={handleLike}
      disabled={!isLoggedIn}
    >
      {optimisticState.isLiked ? (
        <Heart className="text-red-500 fill-red-500" />
      ) : (
        <Heart />
      )}
      {optimisticState.likeCount}
    </Button>
  );
};
