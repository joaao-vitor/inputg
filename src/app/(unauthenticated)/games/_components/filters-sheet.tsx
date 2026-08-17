import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { fetchPlatformsFromIGDB } from "@/lib/dal/fetch-platform";
import { PlatformFromIGDB } from "@/types/platform.types";
import { useQuery } from "@tanstack/react-query";
import { Joystick, X } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { parseAsArrayOf } from "nuqs";
import { useState } from "react";

export const FiltersSheet = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [platformsFilter, setPlatformsFilter] = useQueryState(
    "platforms",
    parseAsArrayOf(parseAsString),
  );
  const [genresFilter, setGenresFilter] = useQueryState(
    "genres",
    parseAsArrayOf(parseAsString),
  );

  const { data: platforms } = useQuery({
    queryKey: ["igdb-platforms"],
    queryFn: fetchPlatformsFromIGDB,
  });
  
  const platformItems = platforms?.map((platform: PlatformFromIGDB) => ({
    value: platform.slug,
    label: platform.name,
  }));
  const platformLookup = platforms?.reduce(
    (acc, platform) => ({
      ...acc,
      [platform.slug]: platform.name,
    }),
    {} as Record<string, string>,
  );
  const removePlatformFilter = (platformSlug: string) => {
    setPlatformsFilter(
      (prev) => prev?.filter((slug) => slug !== platformSlug) || [],
    );
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={"p-4"}>
        <SheetHeader>Filter</SheetHeader>
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-muted-foreground flex items-center gap-2">
            <Joystick size={15} className="font-normal" />
            Filter by platform
          </p>
          <Select
            multiple
            onValueChange={(v) => {
              setPlatformsFilter(v);
            }}
            value={platformsFilter}
            items={platformItems}
          >
            <SelectTrigger className={"w-full"}>
              Select a platform...
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {platforms?.map((platform) => (
                  <SelectItem key={platform.id} value={platform.slug}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-4 flex-wrap">
            {platformLookup &&
              platformsFilter?.map((platformSlug) => (
                <Badge
                  variant={"outline"}
                  className="cursor-pointer  hover:border-red-700 hover:bg-muted transition-all duration-300 group"
                  onClick={() => removePlatformFilter(platformSlug)}
                  key={platformSlug}
                >
                  {platformLookup[platformSlug]}
                  <X className="group-hover:text-red-700" />
                </Badge>
              ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
