-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_stackId_fkey";

-- DropForeignKey
ALTER TABLE "CardStack" DROP CONSTRAINT "CardStack_groupId_fkey";

-- AddForeignKey
ALTER TABLE "CardStack" ADD CONSTRAINT "CardStack_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "CardStack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
