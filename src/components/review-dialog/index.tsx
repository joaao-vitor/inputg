import { Suspense } from "react";
import { ReviewDialog } from "./review-dialog";

export const ReviewDialogWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewDialog />
    </Suspense>
  );
};
