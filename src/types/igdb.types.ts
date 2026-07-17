export interface IGDBGame {
  id: number;
  name: string;
  slug: string;
  summary: string;
  first_release_date: number;
  game_type: string;
  cover?: {
    image_id: string;
  };
  version_parent?: {
    id: number;
  };
  genres?: {
    name: string;
    slug: string;
  }[];
  platforms?: {
    name: string;
    slug: string;
  }[];
}