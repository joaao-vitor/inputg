import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fetchPopularReviews } from "@/lib/dal/fetch-reviews";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";

export const PopularReviews = async () => {
  const reviews = await fetchPopularReviews({ take: 4 });
  return (
    <section className="p-6">
      <div>
        <h2 className="block w-full border-b text-muted-foreground border-muted-foreground/40 pb-2 ">
          some great reviews this week
        </h2>
      </div>
      <div className="md:grid md:grid-cols-2 gap-6 mt-6">
        {reviews?.map((review) => (
          <div key={review.id}>
            <div className="flex gap-6 w-full">
              <Link
                href={`/games/${review.game.slug}`}
                className="group relative aspect-3/4 w-32 h-36 outline-1 outline-accent-foreground/50 shadow-md rounded-sm overflow-hidden "
              >
                <Image
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${review.game.igdbImageId}.jpg`}
                  alt="Game Cover"
                  fill={true}
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </Link>

              <div className="flex flex-col gap-2 w-full">
                <Link href={`/games/${review.game.slug}`}>
                  <h1 className="font-mono font-bold text-xl group">
                    <span className="group-hover:text-primary group-hover:shadow transition-colors duration-300">
                      {review.game.name}
                    </span>{" "}
                    <span className="font-light text-muted-foreground">
                      {review.game.releaseDate?.getFullYear() || "N/A"}
                    </span>
                  </h1>
                </Link>
                <div className="flex items-center justify-between w-full">
                  <Link href={""}>
                    <div className="flex gap-2 items-center group">
                      <Avatar>
                        <AvatarImage src={review.user.image || ""} alt="User" />
                        <AvatarFallback>
                          {review.user.username?.slice(0, 2).toUpperCase() ||
                            "US"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground/70 transition duration-300">
                        {review.user.username}
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center">
                    <Star className="text-amber-400 fill-amber-400 w-4 h-4" />
                    <span className="text-sm font-semibold ml-1">{review.userGame.rating?.toFixed(1) || "N/A"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground line-clamp-6">
                    {review.content}
                  </p>

                  <span className="self-end text-muted-foreground flex gap-2 items-center text-sm">
                    <FaHeart /> {review.likesCount} likes
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
