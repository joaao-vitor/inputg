"use client";
import { GameCard } from "@/components/game-card";
import { Spinner } from "@/components/ui/spinner";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { fetchGames } from "@/lib/dal/fetch-game";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Page() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["games-infinite"],
      queryFn: ({ pageParam }) => {
        return fetchGames(undefined, 50, pageParam);
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: "",
    });
  const { loadMoreRef } = useInfiniteScroll({
    callback: fetchNextPage,
    disabled: !hasNextPage || isFetchingNextPage,
    rootMargin: "100px",
  });
  return (
    <div className="flex flex-col items-center relative">
      <div className="container flex p-6 pt-24">
        <main className="w-full flex flex-col gap-8">
          <div className="w-full">
            <header className="py-4">
              <h1 className="font-semibold font-mono text-lg text-muted-foreground">
                All games
              </h1>
            </header>
            <div className="grid grid-cols-8 w-full gap-6">
              {data?.pages.map((page) =>
                page.games.map((game) => (
                  <GameCard game={game} key={game.id} />
                )),
              )}
            </div>
          </div>
          <div ref={loadMoreRef} className="py-4 self-center">
            {isFetchingNextPage && <Spinner className="h-8 w-8" />}
          </div>
        </main>
      </div>
    </div>
  );
}
