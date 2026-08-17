import { fetchOnIGDB } from "./igdb.service";
import { GenreFromIGDB } from "@/types/genre.types";

export const getAllGenresFromIGDB = async (): Promise<GenreFromIGDB[]> => {
  const query = `fields id, name, slug; limit 500; sort name asc;`;
  const genres = await fetchOnIGDB("genres", query);
  return genres;
};
