import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { groupId: string } }) {
  const { groupId } = await context.params;

  try {
    const group = await prisma.group.findUnique({
      where: { id: Number(groupId) },
      include: { cardStacks: true }, // Include card stacks if needed
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
