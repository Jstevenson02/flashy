// filepath: c:\Projects\flashy\app\api\groups\[groupId]\cardstacks\[stackId]\route.ts
import { NextResponse } from "next/server";

// Mock database function (replace with your actual database logic)
const deleteCardStackFromDatabase = async (groupId: string, stackId: string) => {
  // Replace this with your actual database query
  console.log(`Deleting card stack ${stackId} from group ${groupId}`);
  return true; // Return true if deletion is successful
};

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string; stackId: string } }
) {
  const { groupId, stackId } = params;

  if (!groupId || !stackId) {
    return NextResponse.json({ error: "Group ID and Stack ID are required" }, { status: 400 });
  }

  try {
    const success = await deleteCardStackFromDatabase(groupId, stackId);
    if (success) {
      return NextResponse.json({ message: "Card stack deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to delete card stack" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error deleting card stack:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
