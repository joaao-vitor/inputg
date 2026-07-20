"use client";
import { StarRating } from "@/components/star-rating";
import { changeGameRating } from "@/lib/actions/game/change-status";
import { toast } from "sonner";

export const GameRating = ({
  gameId,
  defaultRating,
}: {
  gameId: string;
  defaultRating: number;
}) => {

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
    <div className="flex w-full items-center justify-center rounded-lg bg-input/30 p-2 mt-2 outline outline-muted-foreground/30">
      <StarRating
        onChange={handleRatingChange}
        defaultValue={defaultRating}
        onDelete={handleDeleteRating}
      />
    </div>
  );
};