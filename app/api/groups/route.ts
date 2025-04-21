import { NextResponse } from "next/server";
import { createGroup, getGroups } from "@/utils/db";

export async function GET() {
  try {
    const groups = await getGroups();
    return NextResponse.json(groups);
  } catch {
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const newGroup = await createGroup(name);
    return NextResponse.json(newGroup);
  } catch {
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}
