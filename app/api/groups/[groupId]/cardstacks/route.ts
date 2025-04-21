import { NextResponse } from "next/server";
import { createCardStack, deleteCardStack, getCardStacksByGroupId } from "@/utils/db";

export async function GET(req: Request, context: { params: { groupId: string } }) {
  try {
    const { groupId } = await context.params; // Await the params object
    const cardStacks = await getCardStacksByGroupId(groupId);
    return NextResponse.json(cardStacks);
  } catch {
    return NextResponse.json({ error: "Failed to fetch card stacks" }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: { groupId: string } }) {
  try {
    const { groupId } = await context.params; // Await the params object
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const newCardStack = await createCardStack(groupId, name);
    return NextResponse.json(newCardStack);
  } catch {
    return NextResponse.json({ error: "Failed to create card stack" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string; stackId: string } }
) {
  const { stackId } = params;

  if (!stackId) {
    return NextResponse.json({ error: "Stack ID is required" }, { status: 400 });
  }

  try {
    // Call the Prisma function to delete the card stack
    await deleteCardStack(stackId);

    return NextResponse.json({ message: "Card stack deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting card stack:", error);
    return NextResponse.json({ error: "Failed to delete card stack" }, { status: 500 });
  }
}
