import { Suspense } from "react";
import GamePageWrapper from "./game-page";

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading game data...</div>}>
      <GamePageWrapper params={params} />
    </Suspense>
  );
}
