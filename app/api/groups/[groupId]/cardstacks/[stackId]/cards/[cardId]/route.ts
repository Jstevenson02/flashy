// filepath: c:\Projects\flashy\app\api\groups\[groupId]\cardstacks\[stackId]\cards\[cardId]\route.ts
import { NextResponse } from "next/server";
import { deleteCard } from "@/utils/db";

export async function DELETE(req: Request, context: { params: { cardId: string } }) {
  try {
    const { cardId } = await context.params; // Access the cardId from params
    await deleteCard(cardId); // Call the database utility to delete the card
    return NextResponse.json({ message: "Card deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}
