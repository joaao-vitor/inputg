import { Suspense } from "react";
import { GameDetails } from "./_components/game-details";

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
