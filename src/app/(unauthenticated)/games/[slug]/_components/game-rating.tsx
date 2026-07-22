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
    <StarRating
      onChange={handleRatingChange}
      defaultValue={defaultRating}
      onDelete={handleDeleteRating}
    />
  );
};
