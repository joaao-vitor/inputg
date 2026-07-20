import { StarRating } from "@/components/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GameStatus } from "@/generated/prisma/enums";
import { Circle, Dot } from "lucide-react";

export const Review = () => {
  const statusTypes = [
    {
      value: GameStatus.WANT_TO_PLAY,
      label: (
        <span className="flex items-center gap-2">
          <Circle className="w-2 h-2 fill-muted-foreground/50" />
          Want to play
        </span>
      ),
    },
    {
      value: GameStatus.PLAYING,
      label: (
        <span className="flex items-center gap-2">
          <Circle className="w-2 h-2 fill-yellow-700 text-yellow-700" />
          Playing
        </span>
      ),
    },
    {
      value: GameStatus.COMPLETED,
      label: (
        <span className="flex items-center gap-2">
          <Circle className="w-2 h-2 fill-green-700 text-green-700" />
          Completed
        </span>
      ),
    },
    {
      value: GameStatus.ABANDONED,
      label: (
        <span className="flex items-center gap-2">
          <Circle className="w-2 h-2 fill-red-700 text-red-700" />
          Abandoned
        </span>
      ),
    },
    {
      value: GameStatus.ON_HOLD,
      label: (
        <span className="flex items-center gap-2">
          <Circle className="w-2 h-2 fill-blue-700 text-blue-700" />
          On Hold
        </span>
      ),
    },
  ];
  return (
    <div className="flex gap-4 cursor-pointer group">
      <Avatar className={"self-start"}>
        <AvatarImage />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full text-sm">
          <span className="font-mono text-accent-foreground/90 group-hover:text-primary-foreground transition-colors duration-300">
            johndoe
          </span>
          <div className="w-24">
            <StarRating value={5} readOnly />
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground/50 text-xs w-full">
          <span>{statusTypes[0].label}</span>
          <span className="flex items-center">
            <Dot />
            PC
          </span>

          <span className="ml-auto">13 days ago</span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-accent-foreground/70 group-hover:text-accent-foreground/90 transition-colors duration-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint sed
            temporibus soluta fugiat, dignissimos facilis cum voluptates
            quisquam rerum qui non, fuga officia recusandae. Quae totam mollitia
            omnis molestias veniam!
          </p>
        </div>
      </div>
    </div>
  );
};
