-- AlterTable
ALTER TABLE "user" ADD COLUMN     "displayUsername" TEXT,
ADD COLUMN     "username" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
