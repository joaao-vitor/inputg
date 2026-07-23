import { StarRating } from "@/components/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GameStatus } from "@/generated/prisma/enums";
import { ReviewWithRelations } from "@/types/review.types";
import { Circle, Dot } from "lucide-react";
import { ReactNode } from "react";
import { formatDistance } from "date-fns";

export const Review = ({ review }: { review: ReviewWithRelations }) => {
  const statusTypes: Record<GameStatus, { label: string; icon: ReactNode }> = {
    [GameStatus.WANT_TO_PLAY]: {
      label: "Want to play",
      icon: <Circle className="w-2 h-2 fill-muted-foreground/50" />,
    },

    [GameStatus.PLAYING]: {
      label: "Playing",
      icon: <Circle className="w-2 h-2 fill-yellow-700 text-yellow-700" />,
    },

    [GameStatus.COMPLETED]: {
      label: "Completed",
      icon: <Circle className="w-2 h-2 fill-green-700 text-green-700" />,
    },

    [GameStatus.ABANDONED]: {
      label: "Abandoned",
      icon: <Circle className="w-2 h-2 fill-red-700 text-red-700" />,
    },

    [GameStatus.ON_HOLD]: {
      label: "On Hold",
      icon: <Circle className="w-2 h-2 fill-blue-700 text-blue-700" />,
    },
  };
  return (
    <div className="flex gap-4 cursor-pointer group">
      <Avatar className={"self-start"}>
        <AvatarImage src={review.user.image || undefined} />
        <AvatarFallback>
          {review.user.username?.slice(0, 1) || "UN"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full text-sm">
          <span className="font-mono text-accent-foreground/90 group-hover:text-primary-foreground transition-colors duration-300">
            {review.user.username}
          </span>
          <div className="w-24">
            <StarRating value={review.userGame.rating || 0} readOnly />
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground/50 text-xs w-full">
          <span className="flex items-center gap-2">
            {statusTypes[review.userGame.status].icon}
            {statusTypes[review.userGame.status].label}
          </span>
          <span className="flex items-center">
            <Dot />
            PC
          </span>

          <span className="ml-auto">
            {formatDistance(new Date(), review.createdAt)}
          </span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-accent-foreground/70 group-hover:text-accent-foreground/90 transition-colors duration-300">
            {review.content}
          </p>
        </div>
      </div>
    </div>
  );
};
