"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { fetchGameAsUser } from "@/lib/dal/fetch-game";
import { ReviewForm } from "./review-form";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { reviewFormSchema } from "@/schemas/create-review.schema";
import { sendReview } from "@/lib/actions/game/send-review";
import { toast } from "sonner";
import z from "zod";

export const ReviewDialog = () => {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useQueryState(
    "review-dialog",
    parseAsBoolean.withDefault(false),
  );
  const [reviewId, setReviewId] = useQueryState(
    "review-id",
    parseAsString.withDefault(""),
  );
  const [gameSlug, setGameSlug] = useQueryState(
    "game-slug",
    parseAsString.withDefault(""),
  );

  const { data: gameData } = useQuery({
    queryKey: ["gameAsUser", gameSlug],
    queryFn: () => fetchGameAsUser(gameSlug),
    enabled: open && !!gameSlug,
  });

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setGameSlug(open ? gameSlug : "");
  };

  if (!isPending && !session) {
    return <div>Please log in to leave a review.</div>;
  }

  if (!gameData) return null;

  const onSubmit = async (data: z.infer<typeof reviewFormSchema>) => {
    try {
      await sendReview({ gameId: gameData.id, ...data });
      toast.success("Review created successfully!");
      handleOpenChange(false);
    } catch (error) {
      toast.error(`Error creating review`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={"md:min-w-lg p-6"}>
        <div className="flex gap-4">
          <div className="w-20 shrink-0 self-start aspect-3/4 relative">
            <Image
              src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${gameData.igdbImageId}.jpg`}
              alt={gameData.name}
              fill
              className=" object-cover"
            />
          </div>
          <div className="text-sm/4 flex-1 flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold">{gameData.name}</h1>
              <p className="text-muted-foreground">Did you like this game?</p>
            </div>

            <ReviewForm
              gameData={gameData}
              onCancel={() => handleOpenChange(false)}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
