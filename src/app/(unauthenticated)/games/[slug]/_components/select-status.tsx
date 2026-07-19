"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameStatus } from "@/generated/prisma/enums";
import { changeGameStatus } from "../../../../../lib/actions/game/change-status";
import { toast } from "sonner";
import { Circle } from "lucide-react";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";

export const SelectGameStatus = ({ isAuthenticated, gameId, defaultStatus }: { isAuthenticated: boolean; gameId: string; defaultStatus?: GameStatus }) => {
  
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

  const [isPending, startTransition] = useTransition();

  const onStatusChange = async (status: GameStatus) => {
    startTransition(async () => {
      try {
        await changeGameStatus(gameId, status);
        toast.success("Game status updated successfully!");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An error occurred while updating the game status.",
        );
      }
    });
  };
  return (
    <Select
      items={selectItems}
      onValueChange={(v) => onStatusChange(v as GameStatus)}
      disabled={isPending || !isAuthenticated}
      defaultValue={defaultStatus}
    >
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
  );
};
