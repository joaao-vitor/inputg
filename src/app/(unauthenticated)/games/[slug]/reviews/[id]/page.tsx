import { getReviewById } from "@/lib/services/game-review.service";
import { ReviewSection } from "./_components/review-section";
import Image from "next/image";
import { GameAside } from "../../_components/game-aside";

export default async function ReviewPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const { slug, id } = await params;
  const review = await getReviewById(id);

  if (!review) {
    return <div>Review not found</div>;
  }

  return (
    <div className="flex flex-col items-center relative">
      <div className="relative h-[50vh] container max-h-128 max-w-7xl">
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_1080p_2x/${review.game.screenshotsIds?.[review.game.screenshotsIds.length - 1]}.jpg`}
          alt={review.game.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent"></div>
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/10 to-transparent"></div>
        <div className="absolute inset-0 bg-linear-to-l from-background via-background/10 to-transparent"></div>
      </div>
      <div className="container max-w-7xl -mt-64 px-6 flex gap-12 z-51">
        <GameAside game={review.game} />
        <ReviewSection review={review} />
      </div>
    </div>
  );
}
