import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";

export const PopularReviews = () => {
  return (
    <section className="p-6">
      <div>
        <h2 className="block w-full border-b text-muted-foreground border-muted-foreground/40 pb-2 ">
          some great reviews this week
        </h2>
      </div>
      <div className="md:grid md:grid-cols-2 gap-6 mt-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="flex gap-6 w-full">
              <Link
                href={""}
                className="group relative aspect-3/4 w-32 h-36 outline-1 outline-accent-foreground/50 shadow-md rounded-sm overflow-hidden "
              >
                <Image
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1r5o.jpg`}
                  alt="Game Cover"
                  fill={true}
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </Link>

              <div className="flex flex-col gap-2 w-full">
                <Link href={""}>
                  <h1 className="font-mono font-bold text-xl group">
                    <span className="group-hover:text-primary group-hover:shadow transition-colors duration-300">
                      Game Title
                    </span>{" "}
                    <span className="font-light text-muted-foreground">
                      2026
                    </span>
                  </h1>
                </Link>
                <div className="flex items-center justify-between w-full">
                  <Link href={""}>
                    <div className="flex gap-2 items-center group">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback>UC</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground/70 transition duration-300">
                        Username
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center">
                    <Star className="text-amber-400 fill-amber-400 w-4 h-4" />
                    <span className="text-sm font-semibold ml-1">4.5</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground line-clamp-6">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatibus cumque perferendis inventore nulla, rem,
                    voluptatum delectus quas iusto facere eum laudantium magni
                    consequatur architecto. Est delectus culpa consequatur quod
                    a.
                  </p>

                  <span className="self-end text-muted-foreground flex gap-2 items-center text-sm">
                    <FaHeart /> 6321 likes
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
