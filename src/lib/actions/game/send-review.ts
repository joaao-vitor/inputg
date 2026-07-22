"use server";

import { auth } from "@/lib/auth";
import { upsertReview } from "@/lib/services/game-review.service";
import { ReviewActionSchema } from "@/schemas/create-review.schema";
import { headers } from "next/headers";

export const sendReview = async (data: ReviewActionSchema) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const review = await upsertReview({ userId: session.user.id, ...data });
  return review;
};
