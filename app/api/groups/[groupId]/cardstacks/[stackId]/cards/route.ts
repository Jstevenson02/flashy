// filepath: c:\Projects\flashy\app\api\groups\[groupId]\cardstacks\[stackId]\cards\route.ts
import { NextResponse } from "next/server";
import { createCard, getCardsByStackId } from "@/utils/db";

export async function GET(req: Request, { params }: { params: { stackId: string } }) {
  try {
    const { stackId } = params;
    const cards = await getCardsByStackId(stackId);
    return NextResponse.json(cards);
  } catch {
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { stackId: string } }) {
  try {
    const { stackId } = params;
    const { frontText, backText } = await req.json();
    const newCard = await createCard(stackId, frontText, backText);
    return NextResponse.json(newCard);
  } catch {
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
}
