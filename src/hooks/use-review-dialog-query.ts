import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

export const useReviewDialogQuery = () => {
  const [open, setOpen] = useQueryState(
    "review-dialog",
    parseAsBoolean.withDefault(false),
  );
  const [reviewId, setReviewId] = useQueryState(
    "review-id",
    parseAsString.withDefault(""),
  );
  const [gameSlug, setGameSlug] = useQueryState(
    "game-slug",
    parseAsString.withDefault(""),
  );

  const openAsCreate = (gameSlug: string) => {
    setOpen(true);
    setGameSlug(gameSlug);
    setReviewId("");
  };

  const openAsEdit = (gameSlug: string, reviewId: string) => {
    setOpen(true);
    setGameSlug(gameSlug);
    setReviewId(reviewId);
  };

  const close = () => {
    setOpen(false);
    setGameSlug("");
    setReviewId("");
  };

  return { open, setOpen, openAsCreate, openAsEdit, reviewId, gameSlug, close };
};
