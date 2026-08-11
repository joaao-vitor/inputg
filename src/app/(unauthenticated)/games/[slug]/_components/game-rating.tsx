"use client";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { changeGameRating } from "@/lib/actions/game/change-status";
import { Plus } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";

export const GameRating = ({
  gameId,
  gameSlug,
  defaultRating,
}: {
  gameId: string;
  gameSlug: string;
  defaultRating: number;
}) => {
  const [, setIsCreateReviewOpen] = useQueryState(
    "review-dialog",
    parseAsBoolean.withDefault(false),
  );
  const [, setCreateReviewGameSlug] = useQueryState(
    "game-slug",
    parseAsString.withDefault(""),
  );

  const handleRatingChange = async (newRating: number) => {
    try {
      await changeGameRating(gameId, newRating);
    } catch (error) {
      toast.error("Failed to update rating. Please try again.");
      console.error("Error updating rating:", error);
    }
  };

  const handleDeleteRating = async () => {
    try {
      await changeGameRating(gameId, null);
    } catch (error) {
      toast.error("Failed to delete rating. Please try again.");
      console.error("Error deleting rating:", error);
    }
  };

  return (
    <div className="flex flex-col w-full rounded-lg bg-input/30 p-2 mt-2 outline outline-muted-foreground/30 gap-4">
      <StarRating
        onChange={handleRatingChange}
        defaultValue={defaultRating}
        onDelete={handleDeleteRating}
      />

      <hr className="border-.5 border-muted-foreground/25" />
      <div className="flex gap-2 items-center justify-center text-muted-foreground text-sm">
        <Button
          variant={"link"}
          className={"text-inherit"}
          onClick={() => {
            setIsCreateReviewOpen(true);
            setCreateReviewGameSlug(gameSlug);
          }}
        >
          <Plus /> Share your review
        </Button>
      </div>
    </div>
  );
};
