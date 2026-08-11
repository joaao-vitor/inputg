"use client";
import { ReviewLikeButton } from "@/components/review-like-button";
import { StarRating } from "@/components/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useReviewDialogQuery } from "@/hooks/use-review-dialog-query";
import { authClient } from "@/lib/auth-client";
import { ReviewWithRelationsAndGame } from "@/types/review.types";
import { format } from "date-fns";
import { SquarePen } from "lucide-react";
import Link from "next/link";

export const ReviewSection = ({
  review,
}: {
  review: ReviewWithRelationsAndGame;
}) => {
  const { openAsEdit } = useReviewDialogQuery();
  const handleEditClick = () => {
    openAsEdit(review.game.slug, review.id);
  };

  const { data: session, isPending } = authClient.useSession();
  return (
    <main className="flex flex-col gap-4 mt-48 w-full">
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarFallback>
                {review.user.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
              <AvatarImage src={review.user.image || ""} />
            </Avatar>
            <h3 className="text-sm text-muted-foreground font-light">
              Review by{" "}
              <span className="font-semibold">{review.user.username}</span>
            </h3>
          </div>
          <div>
            {!isPending && session && session.user?.id === review.user.id && (
              <Button
                variant={"ghost"}
                size={"xs"}
                className={"text-muted-foreground cursor-pointer"}
                onClick={handleEditClick}
              >
                <SquarePen /> EDIT OR DELETE THIS REVIEW
              </Button>
            )}
          </div>
        </div>
        <hr />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl text-accent-foreground group hover:text-primary dark:hover:text-primary-foreground transition duration-300 font-mono">
          <Link href={`/games/${review.game.slug}`}>
            {review.game.name}
            <span className="text-base text-muted-foreground font-light font-sans ml-2">
              {review.game.releaseDate?.getFullYear()}
            </span>
          </Link>
        </h1>
        <div className="w-24">
          <StarRating defaultValue={review.userGame.rating || 0} readOnly />
        </div>
        <p className=" text-sm text-muted-foreground/50">
          Reviewed {format(review.createdAt, "MMMM d, yyyy")}
        </p>
        <div className="prose prose-invert max-w-none text-muted-foreground">
          {review.content}
        </div>
        <ReviewLikeButton
          reviewId={review.id}
          initialIsLiked={review.isLiked}
          initialLikeCount={review.likesCount}
          isLoggedIn={true}
        />
      </div>
    </main>
  );
};
