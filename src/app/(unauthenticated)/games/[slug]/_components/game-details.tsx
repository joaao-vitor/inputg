import { GameWithRelations } from "@/types/game.types";
import Link from "next/link";

export const GameDetails = async ({ game }: { game: GameWithRelations }) => {
  if (!game) return <div>Game not found</div>;
  return (
    <div className="flex flex-col items-center md:flex-row gap-6 w-full">
      <div className="flex flex-col h-full justify-end gap-8 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6">
          <div className="mb-4 col-span-3">
            <h1 className="text-4xl font-bold font-mono text-center md:text-left mb-4">
              {game.name}{" "}
              <span className="text-xl font-light text-muted-foreground">
                {game.releaseDate?.getFullYear()}
              </span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2">{game.summary}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 space-y-4 text-sm col-span-2 ">
            <div className="col-span-1 ">
              <p className="uppercase text-muted-foreground font-semibold">
                GENRES
              </p>
            </div>
            <div className="col-span-3 flex space-x-6 space-y-1 flex-wrap">
              {game.genres.map((genre) => (
                <Link href={`/genre/${genre.slug}`} key={genre.id}>
                  <span className="text-muted-foreground underline underline-offset-6 hover:text-accent-foreground transition duration-300">
                    {genre.name}{" "}
                  </span>
                </Link>
              ))}
            </div>
            <div className="col-span-1">
              <p className="uppercase text-muted-foreground font-semibold">
                PLATFORMS
              </p>
            </div>
            <div className="col-span-3 flex space-x-6 space-y-1 flex-wrap">
              {game.platforms.map((platform) => (
                <Link href={`/platform/${platform.slug}`} key={platform.id}>
                  <span className="text-muted-foreground underline underline-offset-6 hover:text-accent-foreground transition duration-300">
                    {platform.name}{" "}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full flex items-center self-end gap-4">
          <hr className="flex-1 border-t border-muted-foreground/25 rounded-2xl" />
          <span className="text-sm text-muted-foreground">
            More info on{" "}
            <Link
              href={`https://www.igdb.com/games/${game.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-foreground duration-300"
            >
              IGDB
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
