import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: { params: { groupId: string; stackId: string } }
) {
  const { groupId, stackId } = await context.params; // Await the params object

  if (!groupId || !stackId) {
    return NextResponse.json({ error: "Group ID and Stack ID are required" }, { status: 400 });
  }

  try {
    // Delete related cards first (if any)
    await prisma.card.deleteMany({
      where: { stackId: Number(stackId) },
    });

    // Delete the card stack
    await prisma.cardStack.delete({
      where: { id: Number(stackId) },
    });

    return NextResponse.json({ message: "Card stack deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting card stack:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
