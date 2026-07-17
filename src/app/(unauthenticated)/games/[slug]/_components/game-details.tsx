import { getGameBySlug } from "@/lib/services/game.service";
import Image from "next/image";

export const GameDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return <div>Game not found</div>;
  return (
    <main className="flex flex-col items-center relative w-full h-full">
      <div className="relative w-full min-h-[70vh]">
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.screenshotsIds[0]}.jpg`}
          alt={game?.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/60 backdrop-blur-xs"></div>
      </div>
      <section className="container flex flex-col px-4 -mt-48 relative">
        <div className="flex gap-6">
          <div className="relative aspect-3/4 w-48 shrink-0 rounded-xl overflow-hidden shadow-xl/50 shadow-emerald-900/30">
            <Image
              src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.igdbImageId}.jpg`}
              alt={game?.name}
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <div className="self-end flex-1 flex flex-col md:flex-row gap-6">
            <div className="">
              <h1 className="text-4xl font-bold font-mono">
                {game.name}{" "}
                <span className="text-xl font-light text-muted-foreground">
                  {game.releaseDate?.getFullYear()}
                </span>
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                {game.summary}
              </p>
            </div>
            <div className="grid grid-cols-4 space-y-4 text-sm">
              <div className="col-span-1">
                <p className="uppercase text-muted-foreground font-semibold text-sm">
                  GENRES
                </p>
              </div>
              <div className="col-span-3 flex space-x-6 space-y-1 flex-wrap">
                {game.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="text-muted-foreground underline underline-offset-6"
                  >
                    {genre.name}{" "}
                  </span>
                ))}
              </div>
              <div className="col-span-1">
                <p className="uppercase text-muted-foreground font-semibold text-sm">
                  PLATFORMS
                </p>
              </div>
              <div className="col-span-3 flex space-x-6 space-y-1 flex-wrap">
                {game.platforms.map((platform) => (
                  <span
                    key={platform.id}
                    className="text-muted-foreground underline underline-offset-6"
                  >
                    {platform.name}{" "}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
