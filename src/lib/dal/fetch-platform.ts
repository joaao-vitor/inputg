import { PlatformFromIGDB } from "@/types/platform.types";
import { getAllPlatformsFromIGDB } from "../services/platform.service";

export const fetchPlatformsFromIGDB = async (): Promise<PlatformFromIGDB[]> => {
  return getAllPlatformsFromIGDB();
};
