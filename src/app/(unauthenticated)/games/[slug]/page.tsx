import { getGameBySlug } from "@/lib/services/game.service";
import { Suspense } from "react";

async function GameDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  return <h1>{game?.name}</h1>;
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading game data...</div>}>
      <GameDetails params={params} />
    </Suspense>
  );
}
