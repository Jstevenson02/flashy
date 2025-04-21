import { NextResponse } from "next/server";
import { createCard, getCardsByStackId } from "@/utils/db";

export async function GET(req: Request, context: { params: { stackId: string } }) {
  try {
    const { stackId } = await context.params; // Await the params object
    const cards = await getCardsByStackId(stackId);
    return NextResponse.json(cards);
  } catch {
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: { stackId: string } }) {
  try {
    const { stackId } = await context.params; // Await the params object
    const { frontText, backText } = await req.json();
    const newCard = await createCard(stackId, frontText, backText);
    return NextResponse.json(newCard);
  } catch {
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
}
