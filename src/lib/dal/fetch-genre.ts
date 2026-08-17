import { GenreFromIGDB } from "@/types/genre.types";
import { getAllGenresFromIGDB } from "../services/genre.service";

export const fetchAllGenreFromIGDB = async (): Promise<
  GenreFromIGDB[] | null
> => {
  return getAllGenresFromIGDB();
};
