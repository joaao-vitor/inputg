import { Game } from "@/generated/prisma/client";
import prisma from "../prisma";
import { fetchOnIGDB } from "./igdb.service";
import { IGDBGame } from "@/types/igdb.types";

const getGameFromIGDB = async (whereCondition: string) => {
  "use cache";

  const igdbGame = (
    await fetchOnIGDB(
      "games",
      `fields name, platforms.name, platforms.slug, \
     first_release_date, slug, summary, url, game_type, \
     cover.image_id, genres.name, genres.slug, version_parent.id; \
     where ${whereCondition};`,
    )
  )[0];

  if (!igdbGame) return null;

  return igdbGame;
};


const upsertGame = async (igdbGame: IGDBGame, parentGame?: Game | null) => {
  return await prisma.game.upsert({
    where: { igdbId: igdbGame.id },
    update: {
      name: igdbGame.name,
      summary: igdbGame.summary,

      genres: {
        connectOrCreate: igdbGame.genres?.map((genre) => ({
          where: { slug: genre.slug },
          create: { name: genre.name, slug: genre.slug },
        })),
      },
      platforms: {
        connectOrCreate: igdbGame.platforms?.map((platform) => ({
          where: { slug: platform.slug },
          create: {
            name: platform.name,
            slug: platform.slug,
          },
        })),
      },

      igdbImageId: igdbGame.cover?.image_id || null,
    },
    create: {
      name: igdbGame.name,
      releaseDate: igdbGame.first_release_date
        ? new Date(igdbGame.first_release_date * 1000)
        : null,
      summary: igdbGame.summary,
      slug: igdbGame.slug,
      igdbId: igdbGame.id,
      igdbImageId: igdbGame.cover?.image_id || null,
      igdbGameType: igdbGame.game_type || null,
      versionParentId: parentGame ? parentGame.id : null,
      platforms: {
        connectOrCreate: igdbGame.platforms?.map((platform) => ({
          where: { slug: platform.slug },
          create: { name: platform.name, slug: platform.slug },
        })),
      },
      genres: {
        connectOrCreate: igdbGame.genres?.map((genre) => ({
          where: { slug: genre.slug },
          create: { name: genre.name, slug: genre.slug },
        })),
      },
    },
  });
};

export const getGameBySlug = async (slug: string): Promise<Game | null> => {
  "use cache";

  let game: Game | null = await prisma.game.findUnique({
    where: { slug },
  });

  if (!game) {
    const igdbGame = await getGameFromIGDB(`slug = "${slug}"`);

    if (!igdbGame) return null;

    let parentGame: Game | null = null;

    if (igdbGame.version_parent?.id) {
      parentGame = await getGameByIGDBId(igdbGame.version_parent.id);
    }

    game = await upsertGame(igdbGame, parentGame);
  }
  return game;
};

export const getGameByIGDBId = async (IGDBId: number): Promise<Game | null> => {
  "use cache";

  let game: Game | null = await prisma.game.findUnique({
    where: { igdbId: IGDBId },
  });

  if (!game) {
    const igdbGame = await getGameFromIGDB(`id = ${IGDBId}`);

    if (!igdbGame) return null;

    let parentGame: Game | null = null;
    if (igdbGame.version_parent?.id) {
      parentGame = await getGameByIGDBId(igdbGame.version_parent.id);
    }

    game = await upsertGame(igdbGame, parentGame);
  }

  return game;
};
