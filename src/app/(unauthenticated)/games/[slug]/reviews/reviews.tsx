"use client";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { fetchReviewsByGameSlug } from "@/lib/dal/fetch-reviews";
import { ReviewWithRelations } from "@/types/review.types";
import { Loader2 } from "lucide-react";
import React, { useState, useTransition } from "react";
import { Review } from "../_components/review";
import { GameWithRelations } from "@/types/game.types";
import Link from "next/link";

export const Reviews = ({
  gameDetails,
  initialReviews,
  initialNextCursor,
}: {
  gameDetails: GameWithRelations;
  initialReviews: ReviewWithRelations[];
  initialNextCursor?: string;
}) => {
  const [reviews, setReviews] = useState<ReviewWithRelations[]>(initialReviews);
  const [nextCursor, setNextCursor] = useState<string | undefined>(
    initialNextCursor,
  );
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    if (!nextCursor || isPending) return;
    startTransition(async () => {
      const { reviews, nextCursor: newNextCursor } =
        await fetchReviewsByGameSlug({
          gameSlug: gameDetails.slug,
          take: 10,
          cursor: nextCursor,
        });
      setReviews((prev) => [...prev, ...reviews]);
      setNextCursor(newNextCursor);
    });
  };

  const { loadMoreRef } = useInfiniteScroll({
    callback: loadMore,
    disabled: !nextCursor || isPending,
    rootMargin: "400px",
  });

  return (
    <>
      <div className="flex flex-col mb-4">
        <h2 className="uppercase text-muted-foreground text-sm">Reviews of</h2>
        <h1 className="uppercase font-mono text-2xl text-accent-foreground tracking-tighter group">
          <Link
            href={`/games/${gameDetails.slug}`}
            className="group-hover:text-primary-foreground transition-colors duration-300"
          >
            {gameDetails.name}{" "}
            <span className="text-muted-foreground text-lg group-hover:text-accent-foreground/75 transition-colors duration-300">
              {gameDetails.releaseDate?.getFullYear()}
            </span>
          </Link>
        </h1>
        <hr className="border border-primary/25 my-5 rounded-md" />
      </div>
      <section className="flex flex-col gap-6">
        {reviews.map((review) => (
          <React.Fragment key={review.id}>
            <Review review={review} gameSlug={gameDetails.slug} />
            <hr className="border border-muted-foreground/25 rounded-md" />
          </React.Fragment>
        ))}
        <div>
          {nextCursor && (
            <div
              ref={loadMoreRef}
              className="flex justify-center items-center py-4 text-muted-foreground"
            >
              {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
