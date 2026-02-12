-- AlterTable
ALTER TABLE "AdminLog" ADD COLUMN "actorName" TEXT;

-- AlterTable
ALTER TABLE "AdminLog" ALTER COLUMN "adminId" DROP NOT NULL;
