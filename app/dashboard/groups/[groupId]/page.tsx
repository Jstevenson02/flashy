"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

interface GroupDetailProps {
  params: { groupId: string } | Promise<{ groupId: string }>;
}

const GroupDetail = ({ params }: GroupDetailProps) => {
  const router = useRouter(); // Initialize the router for navigation
  const [groupId, setGroupId] = useState<string | null>(null);
  const [cardStacks, setCardStacks] = useState<{ id: string; name: string }[]>([]);
  const [newStackName, setNewStackName] = useState(""); // State for new card stack name

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params; // Unwrap the Promise if needed
      setGroupId(resolvedParams.groupId);
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchCardStacks = async () => {
      if (groupId) {
        try {
          const response = await fetch(`/api/groups/${groupId}/cardstacks`);
          const data = await response.json();
          setCardStacks(data);
        } catch (error) {
          console.error("Failed to fetch card stacks:", error);
        }
      }
    };

    fetchCardStacks();
  }, [groupId]);

  const handleCreateCardStack = async () => {
    try {
      if (!groupId || !newStackName.trim()) return;
      const response = await fetch(`/api/groups/${groupId}/cardstacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newStackName }),
      });
      if (response.ok) {
        const newStack = await response.json();
        setCardStacks((prevStacks) => [...prevStacks, newStack]);
        setNewStackName(""); // Clear the input field
      }
    } catch (error) {
      console.error("Failed to create card stack:", error);
    }
  };

  const handleDeleteCardStack = async (stackId: string) => {
    try {
      if (!groupId) return;
      const response = await fetch(`/api/groups/${groupId}/cardstacks/${stackId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCardStacks((prevStacks) => prevStacks.filter((stack) => stack.id !== stackId));
      }
    } catch (error) {
      console.error("Failed to delete card stack:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Ensure the container takes up the full viewport height
        margin: 0, // Remove any default margins
        textAlign: "center",
        overflow: "hidden", // Prevent scrolling
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()} // Navigate back to the previous page
        style={{
          position: "fixed", // Keep the button fixed in place
          top: "10px",
          left: "10px",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        Back
      </button>

      <h1 style={{ marginBottom: "20px" }}>Group: {groupId || "Loading..."}</h1>

      {/* Input for New Card Stack Name */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type='text'
          placeholder='Math Flashcards'
          value={newStackName}
          onChange={(e) => setNewStackName(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginRight: "10px",
            width: "200px",
          }}
        />
        <button
          onClick={handleCreateCardStack}
          disabled={!groupId || !newStackName.trim()}
          style={{
            padding: "10px 15px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Card Stack
        </button>
      </div>

      {/* List of Card Stacks */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {cardStacks.map((stack) => (
          <li
            key={stack.id}
            style={{
              display: "flex", // Use flexbox to align items horizontally
              alignItems: "center",
              justifyContent: "space-between", // Space between the name and the delete button
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              width: "300px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <a
              href={`/dashboard/groups/${groupId}/cardstacks/${stack.id}`}
              style={{
                textDecoration: "none",
                color: "blue",
                fontWeight: "bold",
                flex: 1, // Allow the name to take up available space
              }}
            >
              {stack.name}
            </a>
            <button
              onClick={() => handleDeleteCardStack(stack.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupDetail;
