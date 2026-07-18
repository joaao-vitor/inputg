import { Separator } from "@/components/ui/separator";
import { getGameBySlug } from "@/lib/services/game.service";
import Image from "next/image";
import Link from "next/link";

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
      <div className="w-full h-[70vh] max-h-120 sticky">
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.screenshotsIds[0]}.jpg`}
          alt={game?.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/60 backdrop-blur-xs"></div>
      </div>
      <section className="-mt-64 md:-mt-48 z-[50] container flex flex-col px-4">
        <div className="flex flex-col items-center md:flex-row gap-6">
          <div className="relative aspect-3/4 w-48 shrink-0 rounded-xl overflow-hidden shadow-xl/50 shadow-emerald-900/30">
            <Image
              src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.igdbImageId}.jpg`}
              alt={game?.name}
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col h-full justify-end gap-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="mb-4">
                <h1 className="text-4xl font-bold font-mono text-center md:text-left mb-4">
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
                  <p className="uppercase text-muted-foreground font-semibold">
                    GENRES
                  </p>
                </div>
                <div className="col-span-3 flex space-x-6 space-y-1 flex-wrap">
                  {game.genres.map((genre) => (
                    <>
                      <Link href={`/genre/${genre.slug}`} key={genre.id}>
                        <span className="text-muted-foreground underline underline-offset-6 hover:text-accent-foreground transition duration-300">
                          {genre.name}{" "}
                        </span>
                      </Link>
                    </>
                  ))}
                </div>
                <div className="col-span-1">
                  <p className="uppercase text-muted-foreground font-semibold">
                    PLATFORMS
                  </p>
                </div>
                <div className="col-span-3 flex space-x-6 space-y-1 flex-wrap">
                  {game.platforms.map((platform) => (
                    <>
                      <Link
                        href={`/platform/${platform.slug}`}
                        key={platform.id}
                      >
                        <span className="text-muted-foreground underline underline-offset-6 hover:text-accent-foreground transition duration-300">
                          {platform.name}{" "}
                        </span>
                      </Link>
                    </>
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
      </section>
    </main>
  );
};
