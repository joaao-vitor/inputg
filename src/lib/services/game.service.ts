import prisma from "../prisma";
import { fetchOnIGDB } from "./igdb.service";
import { IGDBGame } from "@/types/igdb.types";
import {
  GameFromIGDB,
  GameWithRelations,
  PopularGameSummary,
} from "@/types/game.types";
import { cacheTag } from "next/cache";

export const getGamesFromIGDB = async (
  search?: string,
  take: number = 5,
  cursor?: string,
  platforms?: number[],
  genres?: number[],
): Promise<{ games: GameFromIGDB[]; nextCursor?: string }> => {
  const query = `fields id, name, platforms.name, platforms.slug, \
  first_release_date, slug, summary, url, game_type, \
  cover.image_id, genres.name, genres.slug, version_parent.id, screenshots.image_id; \
  ${search ? `search "${search}";` : ""} \
  ${cursor ? `where id < ${cursor};` : ""} \
  where version_parent = null & game_type = 0 ${platforms ? `& platforms = (${platforms.map((p) => `${p}`).join(",")})` : ""} ${genres ? `& genres = [${genres.map((g) => `${g}`).join(",")}]` : ""};  ${search ? "" : "sort rating desc;"} \
  limit ${take + 1}; `;

  const games = await fetchOnIGDB("games", query);

  let nextCursor = undefined;
  if (games.length > take) {
    nextCursor = games[games.length - 1].id;
  }

  return { games, nextCursor };
};

const getGameFromIGDB = async (whereCondition: string) => {
  "use cache";

  const igdbGame = (
    await fetchOnIGDB(
      "games",
      `fields name, platforms.name, platforms.slug, \
     first_release_date, slug, summary, url, game_type, \
     cover.image_id, genres.name, genres.slug, version_parent.id, screenshots.image_id; \
     where ${whereCondition};`,
    )
  )[0];

  if (!igdbGame) return null;

  return igdbGame;
};

const upsertGame = async (
  igdbGame: IGDBGame,
  parentGame?: GameWithRelations | null,
) => {
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
      screenshotsIds:
        igdbGame.screenshots?.map((screenshot) => screenshot.image_id) || [],

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
      screenshotsIds:
        igdbGame.screenshots?.map((screenshot) => screenshot.image_id) || [],
    },
    include: {
      genres: true,
      platforms: true,
    },
  });
};

export const getGameBySlug = async (
  slug: string,
): Promise<GameWithRelations | null> => {
  "use cache";
  cacheTag(`game-${slug}`);

  let game: GameWithRelations | null = await prisma.game.findUnique({
    where: { slug },
    include: {
      genres: true,
      platforms: true,
    },
  });

  if (!game) {
    const igdbGame = await getGameFromIGDB(`slug = "${slug}"`);

    if (!igdbGame) return null;

    let parentGame: GameWithRelations | null = null;

    if (igdbGame.version_parent?.id) {
      parentGame = await getGameByIGDBId(igdbGame.version_parent.id);
    }

    game = await upsertGame(igdbGame, parentGame);
  }
  return game;
};

export const getGameByIGDBId = async (
  IGDBId: number,
): Promise<GameWithRelations | null> => {
  "use cache";

  let game: GameWithRelations | null = await prisma.game.findUnique({
    where: { igdbId: IGDBId },
    include: {
      genres: true,
      platforms: true,
    },
  });

  if (!game) {
    const igdbGame = await getGameFromIGDB(`id = ${IGDBId}`);

    if (!igdbGame) return null;

    let parentGame: GameWithRelations | null = null;
    if (igdbGame.version_parent?.id) {
      parentGame = await getGameByIGDBId(igdbGame.version_parent.id);
    }

    game = await upsertGame(igdbGame, parentGame);
  }

  return game;
};
export const getPopularGames = async (
  take: number = 10,
): Promise<PopularGameSummary[]> => {
  const games = await prisma.$queryRaw<PopularGameSummary[]>`
    WITH recent_ratings AS (
      SELECT 
        "gameId", 
        AVG(rating)::FLOAT as avg_rating, 
        COUNT(*)::INT as total_ratings 
      FROM user_game 
      WHERE "updatedAt" >= NOW() - INTERVAL '30 days' 
        AND rating > 0 
      GROUP BY "gameId"
    ),

    recent_likes AS (
      SELECT 
        "gameId", 
        COUNT(*)::INT as total_likes 
      FROM game_like 
      WHERE "createdAt" >= NOW() - INTERVAL '30 days' 
      GROUP BY "gameId"
    ),

    all_likes AS (
      SELECT 
        "gameId", 
        COUNT(*)::INT as total_likes 
      FROM game_like 
      GROUP BY "gameId"
    ),
    
    avg_rating_all_time AS (
      SELECT 
        "gameId", 
        AVG(rating)::FLOAT as avg_rating_all_time, 
        COUNT(*)::INT as total_ratings_all_time 
      FROM user_game 
      WHERE rating > 0 
      GROUP BY "gameId"
    )

    SELECT
      g.id, g.name, g.slug, g."igdbImageId",
      COALESCE(r.avg_rating, 0) as "averageRating",
      COALESCE(r.total_ratings, 0) as "totalRatings",
      COALESCE(l.total_likes, 0) as "totalLikes",
      COALESCE(a.avg_rating_all_time, 0) as "averageRatingAllTime",
      COALESCE(a.total_ratings_all_time, 0) as "totalRatingsAllTime",
      COALESCE(al.total_likes, 0) as "totalLikesAllTime",
      (
        (COALESCE(r.avg_rating, 0) * COALESCE(r.total_ratings, 0)) + 
        (COALESCE(l.total_likes, 0) * 2) 
      ) as "trendingScore"
    FROM game g
    LEFT JOIN recent_ratings r ON g.id = r."gameId"
    LEFT JOIN recent_likes l ON g.id = l."gameId"
    LEFT JOIN avg_rating_all_time a ON g.id = a."gameId"
    LEFT JOIN all_likes al ON g.id = al."gameId"
    ORDER BY 
      "trendingScore" DESC,                 
      "totalRatingsAllTime" DESC,           
      "totalLikesAllTime" DESC,             
      g.name ASC                            
    LIMIT ${take};
  `;

  return games;
};
