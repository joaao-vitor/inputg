import { getReviewsByGameId } from "@/lib/services/game-review.service";
import { Review } from "./review";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export const GameReviews = async ({
  gameSlug,
  gameId,
}: {
  gameSlug: string;
  gameId: string;
}) => {
  const { reviews } = await getReviewsByGameId({ gameId, take: 5 });

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-muted-foreground uppercase text-sm flex justify-between">
        <h2>Latest Reviews</h2>
        <Link
          href={`/games/${gameSlug}/reviews`}
          className="hover:text-accent-foreground transition-colors duration-300 flex gap-2 items-center"
        >
          more
          <MoveRight className="w-4" />
        </Link>
      </div>
      <hr className="border-.5 border-muted-foreground/50" />
      <section className="w-full flex flex-col gap-6 mt-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-6">
            <Review review={review} />
            <hr className="w-full border border-muted-foreground/10" />
          </div>
        ))}
      </section>
    </div>
  );
};
