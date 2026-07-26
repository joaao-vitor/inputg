/*
  Warnings:

  - You are about to drop the column `liked` on the `user_game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_game" DROP COLUMN "liked";

-- CreateTable
CREATE TABLE "game_like" (
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_like_pkey" PRIMARY KEY ("userId","gameId")
);

-- AddForeignKey
ALTER TABLE "game_like" ADD CONSTRAINT "game_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_like" ADD CONSTRAINT "game_like_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
