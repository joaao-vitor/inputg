import { GameStatus } from "@/generated/prisma/enums";
import { reviewFormSchema } from "@/schemas/create-review.schema";
import { GameWithUserStatus } from "@/types/game.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Circle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { StarRating } from "../star-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ReviewWithRelations } from "@/types/review.types";
import { sendReview } from "@/lib/actions/game/send-review";
import { toast } from "sonner";
import { useReviewDialogQuery } from "@/hooks/use-review-dialog-query";
import { deleteReview } from "@/lib/actions/game/delete-review";

export const ReviewForm = ({
  gameData,
  review,
}: {
  gameData: GameWithUserStatus;
  review?: ReviewWithRelations | null;
}) => {
  const { close } = useReviewDialogQuery();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    values: {
      rating: gameData.userGameStatus?.rating || 0,
      gameStatus: gameData.userGameStatus?.status || GameStatus.COMPLETED,
      content: review?.content || "",
      platformId: review?.platformId || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof reviewFormSchema>) => {
    try {
      await sendReview({ gameId: gameData.id, ...data });
      toast.success("Review created successfully!");
      close();
    } catch (error) {
      toast.error(`Error creating review`);
    }
  };

  const onCancel = () => {
    close();
  };

  const onDelete = async () => {
    if (!review) return;

    try {
      await deleteReview(review.id);
      toast.success("Review deleted successfully!");
    } catch (error) {
      toast.error(`Error deleting review: ${error}`);
    }
    close();
  };

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

  const platformsSelect = gameData.platforms.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Controller
            name="rating"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="max-w-40" data-invalid={fieldState.invalid}>
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    items={statusSelect}
                    id="status"
                  >
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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                items={platformsSelect}
                id="platform"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Platform you played" />
                </SelectTrigger>
                <SelectContent>
                  {platformsSelect.map((platform) => (
                    <SelectItem value={platform.value} key={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError className="text-xs" errors={[fieldState.error]} />
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
        {review ? (
          <Button
            variant={"destructive"}
            type="button"
            onClick={() => onDelete()}
            disabled={isSubmitting}
          >
            Delete
          </Button>
        ) : (
          <Button
            variant={"secondary"}
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          Confirm
        </Button>
      </div>
    </form>
  );
};
