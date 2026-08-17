import { PlatformFromIGDB } from "@/types/platform.types";
import { fetchOnIGDB } from "./igdb.service";

export const getAllPlatformsFromIGDB = async (): Promise<
  PlatformFromIGDB[]
> => {
  const query = `fields id, name, slug; limit 500; sort name asc;`;
  const platforms = await fetchOnIGDB("platforms", query);
  return platforms;
};
