import { GameStatus } from "@/generated/prisma/enums";
import z from "zod";

export const reviewFormSchema = z.object({
  rating: z
    .number()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating cannot exceed 5"),
  gameStatus: z.enum(GameStatus),
  platformId: z.string().min(1, "Platform is required"),
  content: z.string().min(1, "Review content is required"),
});

export const reviewActionSchema = reviewFormSchema.extend({
  gameId: z.string().min(1, "Game ID is required"),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
export type ReviewActionSchema = z.infer<typeof reviewActionSchema>;

export type CreateReviewDTO = ReviewActionSchema & { userId: string };
