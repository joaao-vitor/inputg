"use client";

import { toggleLikeReview } from "@/lib/actions/game/like-review";
import { useState, useRef, startTransition } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export const ReviewLikeButton = ({
  reviewId,
  initialIsLiked,
  initialLikeCount,
  isLoggedIn,
}: {
  reviewId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
  isLoggedIn: boolean;
}) => {
  const pathname = usePathname();

  // 1. Estado local (não depende do servidor para manter a UI correta após o click)
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // 2. A MÁGICA: Sincronizar estado caso o usuário mude de página e o servidor mande dados novos.
  // Isso resolve a desincronização que você relatou.
  const [prevPropIsLiked, setPrevPropIsLiked] = useState(initialIsLiked);

  if (initialIsLiked !== prevPropIsLiked) {
    setPrevPropIsLiked(initialIsLiked);
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }

  const isExecuting = useRef(false);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn || isExecuting.current) return;
    isExecuting.current = true;

    // Salva o estado atual para reverter em caso de erro
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    // Atualização otimista imediata no estado local
    setIsLiked(!previousIsLiked);
    setLikeCount(
      previousIsLiked ? previousLikeCount - 1 : previousLikeCount + 1,
    );

    startTransition(async () => {
      try {
        // A action roda no fundo revalidando o cache para outras páginas
        const serverResult = await toggleLikeReview(reviewId, pathname);

        // Sincroniza com a verdade do banco de dados no final da action
        setIsLiked(serverResult.isLiked || false);
        setLikeCount(serverResult.likeCount);
      } catch (error) {
        // Deu erro na API? Reverte a UI para como estava
        setIsLiked(previousIsLiked);
        setLikeCount(previousLikeCount);
      } finally {
        isExecuting.current = false;
      }
    });
  };

  return (
    <div className="text-sm flex items-center gap-2">
      <Button
        variant={"link"}
        className={"text-muted-foreground font-semibold px-0"}
        size={"sm"}
        onClick={handleLike}
      >
        <Heart
          className={cn({
            "fill-red-500 text-red-500": isLiked,
          })}
        />
        {isLiked ? "liked" : "like review"}
      </Button>
      <span className="text-muted-foreground/50">{likeCount} likes</span>
    </div>
  );
};
