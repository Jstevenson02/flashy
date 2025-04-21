import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, context: { params: { groupId: string } }) {
  const { groupId } = await context.params; // Await the params object

  try {
    await prisma.group.delete({
      where: { id: Number(groupId) },
    });
    return NextResponse.json({ message: "Group deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json({ error: "Failed to delete group" }, { status: 500 });
  }
}
