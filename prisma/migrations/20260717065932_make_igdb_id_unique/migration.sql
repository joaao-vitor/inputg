/*
  Warnings:

  - A unique constraint covering the columns `[igdbId]` on the table `game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "game_igdbId_key" ON "game"("igdbId");
