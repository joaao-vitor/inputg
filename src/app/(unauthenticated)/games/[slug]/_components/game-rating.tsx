"use client";
import { StarRating } from "@/components/star-rating";
import { changeGameRating } from "@/lib/actions/game/change-status";
import { authClient } from "@/lib/auth-client";
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
    <div className="p-2 outline outline-muted-foreground/30 mt-2 bg-input/30 rounded-lg">
      <StarRating
        onChange={handleRatingChange}
        defaultValue={defaultRating}
        onDelete={handleDeleteRating}
      />
    </div>
  );
};
