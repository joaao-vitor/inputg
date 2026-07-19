import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameStatus } from "@/generated/prisma/enums";
import { GameWithRelations } from "@/types/game.types";
import { Circle, Dot, Heart, Star } from "lucide-react";
import Image from "next/image";

export const GameAside = async ({ game }: { game: GameWithRelations }) => {
  if (!game) return <div>Game not found</div>;

  const selectItems = [
    {
      value: GameStatus.WANT_TO_PLAY,
      label: (
        <span className="flex items-center gap-2">
          <Circle />
          Want to play
        </span>
      ),
    },
    {
      value: GameStatus.PLAYING,
      label: (
        <span className="flex items-center gap-2">
          <Circle className="fill-yellow-700 text-yellow-700" />
          Playing
        </span>
      ),
    },
    {
      value: GameStatus.COMPLETED,
      label: (
        <span className="flex items-center gap-2">
          <Circle className="fill-green-700 text-green-700" />
          Completed
        </span>
      ),
    },
    {
      value: GameStatus.ABANDONED,
      label: (
        <span className="flex items-center gap-2">
          <Circle className="fill-red-700 text-red-700" />
          Abandoned
        </span>
      ),
    },
    {
      value: GameStatus.ON_HOLD,
      label: (
        <span className="flex items-center gap-2">
          <Circle className="fill-blue-700 text-blue-700" />
          On Hold
        </span>
      ),
    },
  ];
  return (
    <aside className="lg:sticky top-0 flex flex-col gap-6 lg:self-start justify-self-center">
      <div className="relative aspect-3/4 w-48 shrink-0 rounded-xl overflow-hidden shadow-xl/50 shadow-emerald-900/30  self-center md:self-start">
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.igdbImageId}.jpg`}
          alt={game?.name}
          fill
          className="object-cover w-full h-full"
        />
      </div>
      <div className="w-full pt-6 flex flex-col gap-4">
        <Select items={selectItems}>
          <SelectTrigger
            className={
              "w-full border-0 shadow-lg shadow-primary/20 text-muted-foreground"
            }
          >
            <SelectValue placeholder="Change Status..." />
          </SelectTrigger>
          <SelectContent>
            {selectItems.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className={"p-2 text-muted-foreground"}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
};
