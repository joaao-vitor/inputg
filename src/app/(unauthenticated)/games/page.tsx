"use client";
import { GameCard } from "@/components/game-card";
import { Spinner } from "@/components/ui/spinner";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { fetchGames } from "@/lib/dal/fetch-game";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiltersSheet } from "./_components/filters-sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { fetchPlatformsFromIGDB } from "@/lib/dal/fetch-platform";
import { PlatformFromIGDB } from "@/types/platform.types";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { fetchAllGenreFromIGDB } from "@/lib/dal/fetch-genre";
import { GenreFromIGDB } from "@/types/genre.types";

export default function Page() {
  const [filterOpen, setFilterOpen] = useState(false);

  const [platformsFilter, setPlatformsFilter] = useQueryState(
    "platforms",
    parseAsArrayOf(parseAsString),
  );
  const [genresFilter, setGenresFilter] = useQueryState(
    "genres",
    parseAsArrayOf(parseAsString),
  );

  const { data: platforms } = useQuery({
    queryKey: ["igdb-platforms"],
    queryFn: fetchPlatformsFromIGDB,
  });

  const { data: genres } = useQuery({
    queryKey: ["igdb-genres"],
    queryFn: fetchAllGenreFromIGDB,
  });

  const filterPlatformIds =
    platforms && platformsFilter
      ? platforms
          .filter((platform) => platformsFilter.includes(platform.slug))
          .map((platform) => platform.id)
      : undefined;

  const genreFilterIds =
    genres && genresFilter
      ? genres
          .filter((genre) => genresFilter.includes(genre.slug))
          .map((genre) => genre.id)
      : undefined;

  const isReadyToFetch =
    (!platformsFilter || platforms !== undefined) &&
    (!genresFilter || genres !== undefined);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["games-infinite", filterPlatformIds, genreFilterIds],
      queryFn: ({ pageParam }) => {
        return fetchGames(
          undefined,
          50,
          pageParam,
          filterPlatformIds && filterPlatformIds?.length > 0 ? filterPlatformIds : undefined,
          genreFilterIds && genreFilterIds?.length > 0 ? genreFilterIds : undefined,
        );
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: "",
      enabled: isReadyToFetch,
    });
  const { loadMoreRef } = useInfiniteScroll({
    callback: fetchNextPage,
    disabled: !hasNextPage || isFetchingNextPage,
    rootMargin: "100px",
  });

  return (
    <>
      <div className="flex flex-col items-center relative">
        <div className="container flex p-6 pt-24">
          <main className="w-full flex flex-col gap-8">
            <div className="w-full">
              <header className="py-4 flex justify-between">
                <h1 className="font-semibold font-mono text-lg text-muted-foreground">
                  All games
                </h1>
                <Button
                  variant={"ghost"}
                  size={"xs"}
                  className={"text-muted-foreground"}
                  onClick={() => setFilterOpen(true)}
                >
                  <Filter /> filter
                </Button>
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
      <FiltersSheet onOpenChange={setFilterOpen} open={filterOpen} />
    </>
  );
}
