import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { fetchAllGenreFromIGDB } from "@/lib/dal/fetch-genre";
import { fetchPlatformsFromIGDB } from "@/lib/dal/fetch-platform";
import { useQuery } from "@tanstack/react-query";
import { GamepadDirectional, Joystick } from "lucide-react";
import { parseAsString, parseAsArrayOf, useQueryState } from "nuqs";
import { SelectFilter } from "./select-filter";

export const FiltersSheet = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [platformsFilter, setPlatformsFilter] = useQueryState(
    "platforms",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [genresFilter, setGenresFilter] = useQueryState(
    "genres",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const { data: platforms } = useQuery({
    queryKey: ["igdb-platforms"],
    queryFn: fetchPlatformsFromIGDB,
  });

  const { data: genres } = useQuery({
    queryKey: ["igdb-genres"],
    queryFn: fetchAllGenreFromIGDB,
  });

  const platformItems = platforms?.map((p) => ({ value: p.slug, label: p.name })) || [];
  const genreItems = genres?.map((g) => ({ value: g.slug, label: g.name })) || [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={"p-4"}>
        <SheetHeader className="mb-6">Filters</SheetHeader>
        
        <div className="flex flex-col gap-6">
          <SelectFilter
            label="Filter by platform"
            icon={<Joystick size={15} />}
            onValueChange={setPlatformsFilter}
            value={platformsFilter}
            items={platformItems}
            placeholder="Select a platform..."
          />
          
          <SelectFilter
            label="Filter by genre"
            icon={<GamepadDirectional size={15} />}
            onValueChange={setGenresFilter}
            value={genresFilter}
            items={genreItems}
            placeholder="Select a genre..."
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};