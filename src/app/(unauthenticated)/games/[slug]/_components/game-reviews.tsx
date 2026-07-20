import { Review } from "./review";

export const GameReviews = ({ gameId }: { gameId: string }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <section className="w-full flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-6">
            <Review key={index} />
            <hr className="w-full border border-muted-foreground/10" />
          </div>
        ))}
      </section>
    </div>
  );
};
