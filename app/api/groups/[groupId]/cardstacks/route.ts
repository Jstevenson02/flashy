import { NextResponse } from "next/server";
import { createCardStack, getCardStacksByGroupId } from "@/utils/db";

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
