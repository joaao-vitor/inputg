import { Hero } from "./(home)/_components/hero";
import { PopularGames } from "./(home)/_components/popular-games";
import { PopularReviews } from "./(home)/_components/popular-reviews";

export default function Page() {
  return (
    <div className="w-full flex flex-col justify-center">
      <Hero />
      <div className="container mx-auto">
        <PopularGames />
        <PopularReviews />
      </div>
    </div>
  );
}
