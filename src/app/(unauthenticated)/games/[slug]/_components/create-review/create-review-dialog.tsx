"use client";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserGame } from "@/generated/prisma/client";
import { GameStatus } from "@/generated/prisma/enums";
import { reviewFormSchema } from "@/schemas/create-review.schema";
import { GameWithRelations } from "@/types/game.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Circle } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export const CreateReviewDialog = ({
  game,
  defaultGameStatus,
}: {
  game: GameWithRelations;
  defaultGameStatus?: UserGame | null;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("create-review") === "true";

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.replace(pathname, { scroll: false });
    }
  };

  const { control, handleSubmit } = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: Number(defaultGameStatus?.rating) || 0,
      gameStatus: defaultGameStatus?.status || GameStatus.COMPLETED,
      content: "",
    },
  });

  // TODO: Future update the select-status.tsx to be more reusable and be usable in this context
  const statusSelect = [
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

  const platformsSelect = game.platforms.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  const onSubmit = (data: z.infer<typeof reviewFormSchema>) => {};

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={"md:min-w-lg p-6"}>
        <div className="flex gap-4">
          <div className="w-20 shrink-0 self-start aspect-3/4 relative">
            <Image
              src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.igdbImageId}.jpg`}
              alt={game?.name}
              fill
              className=" object-cover"
            />
          </div>
          <div className="text-sm/4 flex-1 flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold">{game.name}</h1>
              <p className="text-muted-foreground">Did you like this game?</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        className="max-w-40"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldLabel>Rating</FieldLabel>
                          <StarRating {...field} />
                          {fieldState.invalid && (
                            <FieldError
                              className="text-xs"
                              errors={[fieldState.error]}
                            />
                          )}
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <Controller
                    name="gameStatus"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="w-full sm:w-fit"
                      >
                        <FieldContent className="w-full">
                          <FieldLabel htmlFor="status">Status</FieldLabel>
                          <Select {...field} items={statusSelect} id="status">
                            <SelectTrigger className={"w-full"}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusSelect.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError
                              className="text-xs"
                              errors={[fieldState.error]}
                            />
                          )}
                        </FieldContent>
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="platformId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="platform">Platform</FieldLabel>
                      <Select {...field} items={platformsSelect} id="platform">
                        <SelectTrigger>
                          <SelectValue placeholder="Platform you played" />
                        </SelectTrigger>
                        <SelectContent>
                          {platformsSelect.map((platform) => (
                            <SelectItem
                              value={platform.value}
                              key={platform.value}
                            >
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError
                          className="text-xs"
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="content"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor="content">Content</FieldLabel>
                        <Textarea
                          {...field}
                          id="content"
                          aria-invalid={fieldState.invalid}
                          placeholder="This game is awesome..."
                          className="min-h-36"
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </FieldGroup>
              <div className="flex w-fit gap-2 ml-auto mt-4">
                <Button
                  variant={"secondary"}
                  type="button"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Confirm</Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
