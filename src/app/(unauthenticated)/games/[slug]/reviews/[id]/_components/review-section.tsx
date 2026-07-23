"use client";

import { StarRating } from "@/components/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ReviewWithRelationsAndGame } from "@/types/review.types";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import Link from "next/link";

export const ReviewSection = ({
  review,
}: {
  review: ReviewWithRelationsAndGame;
}) => {
  return (
    <main className="flex flex-col gap-4 mt-48 w-full">
      <div className="w-full space-y-4">
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
        <div className="text-sm flex items-center gap-2">
          <Button
            variant={"link"}
            className={"text-muted-foreground font-semibold px-0"}
            size={"sm"}
          >
            <Heart />
            like review
          </Button>
          <span className="text-muted-foreground/50">1000 likes</span>
        </div>
      </div>
    </main>
  );
};
