"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { fetchGameAsUser } from "@/lib/dal/fetch-game";
import { ReviewForm } from "./review-form";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { reviewFormSchema } from "@/schemas/create-review.schema";
import { sendReview } from "@/lib/actions/game/send-review";
import { toast } from "sonner";
import z from "zod";
import { fetchReviewById } from "@/lib/dal/fetch-reviews";
import { useReviewDialogQuery } from "@/hooks/use-review-dialog-query";

export const ReviewDialog = () => {
  const { data: session, isPending } = authClient.useSession();
  const { gameSlug, reviewId, open, close, setOpen } = useReviewDialogQuery();

  const { data: gameData } = useQuery({
    queryKey: ["gameAsUser", gameSlug],
    queryFn: () => fetchGameAsUser(gameSlug),
    enabled: open && !!gameSlug,
  });

  const { data: reviewData } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => fetchReviewById({ reviewId }),
    enabled: open && !!reviewId,
  });

  const handleOpenChange = (open: boolean) => {
    if (open) close();
    else setOpen(open);
  };

  if (!isPending && !session) return null;

  if (!gameData) return null;

  if (reviewData && reviewData?.user.id !== session?.user?.id) return null;

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
              review={reviewData}
              
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
