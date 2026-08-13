import { useState, useEffect, useRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchGames } from "@/lib/dal/fetch-game";
import Image from "next/image";
import Link from "next/link";

export const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchValue, 500);
  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch],
    enabled: !!debouncedSearch,
    queryFn: async () => {
      const response = await fetchGames(debouncedSearch, 5);
      return response.games;
    },
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full md:w-72" ref={wrapperRef}>
      <Command
        className="relative overflow-visible p-0 bg-background"
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Search for a game..."
          value={searchValue}
          onValueChange={(e) => {
            setSearchValue(e);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full p-0"
        />

        {isOpen && searchValue && (
          <CommandList className="absolute top-full mt-2 left-0 w-full z-50 bg-background border rounded-md shadow-md max-h-72 overflow-y-auto">
            <CommandGroup heading="Suggestions">
              {isLoading ? (
                <div className="p-2 text-muted-foreground text-sm text-center">Searching...</div>
              ) : (
                data?.length === 0 && <CommandEmpty>No games found.</CommandEmpty>
              )}
              {data &&
                data.map((game) => (
                  <CommandItem
                    key={game.id}
                    value={game.name}
                    className="p-2"
                    onSelect={() => setIsOpen(false)}
                  >
                    <Link
                      href={`/games/${game.slug}`}
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex gap-2 group">
                        <Image
                          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover?.image_id}.jpg`}
                          alt={game.name}
                          width={50}
                          height={50}
                          className="rounded-md shadow-md"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-muted-foreground group-hover:text-foreground transition duration-300">
                            {game.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
};
