import { Hero } from "./(home)/_components/hero";
import { PopularGames } from "./(home)/_components/popular-games";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <Hero />
      <div className="container mx-auto">
        <PopularGames />
      </div>
    </div>
  );
}
