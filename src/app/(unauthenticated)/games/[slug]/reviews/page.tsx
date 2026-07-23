import { getReviewsByGameSlug } from "@/lib/services/game-review.service";
import { Reviews } from "./reviews";
import { getGameBySlug } from "@/lib/services/game.service";
import Image from "next/image";
import Link from "next/link";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gameDetails = await getGameBySlug(slug);

  if (!gameDetails) {
    return <div>Game not found</div>;
  }

  const { reviews, nextCursor } = await getReviewsByGameSlug({
    gameSlug: slug,
    take: 10,
  });

  return (
    <div className="flex flex-col items-center relative">
      <div className="absolute inset-0 h-[70vh] w-full bg-linear-to-b from-primary/25 to-transparent"></div>
      <div className="container flex p-6 pt-24 z-50 gap-16">
        <main className="flex-1">
          <Reviews
            gameDetails={gameDetails}
            initialReviews={reviews}
            initialNextCursor={nextCursor}
          />
        </main>
        <aside>
          <div className="sticky top-24">
            <Link href={`/games/${gameDetails.slug}`}>
              <div className="relative group w-56 rounded-lg overflow-hidden  aspect-3/4 shadow-lg shadow-background outline-1 outline-primary/50 mt-6">
                <Image
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${gameDetails.igdbImageId}.jpg`}
                  alt={gameDetails.name}
                  fill
                />
                <div className="absolute inset-0 group-hover:opacity-100 opacity-0 border-2 rounded-lg border-primary/50 transition duration-300"></div>
              </div>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
