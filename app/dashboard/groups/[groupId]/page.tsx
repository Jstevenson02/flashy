"use client";

import { useEffect, useState } from "react";

interface GroupDetailProps {
  params: { groupId: string } | Promise<{ groupId: string }>;
}

const GroupDetail = ({ params }: GroupDetailProps) => {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [cardStacks, setCardStacks] = useState<{ id: string; name: string }[]>([]);

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
      if (!groupId) return;
      const response = await fetch(`/api/groups/${groupId}/cardstacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "New Card Stack" }),
      });
      if (response.ok) {
        const newStack = await response.json();
        setCardStacks((prevStacks) => [...prevStacks, newStack]);
      }
    } catch (error) {
      console.error("Failed to create card stack:", error);
    }
  };

  return (
    <div>
      <h1>Group: {groupId || "Loading..."}</h1>
      <button onClick={handleCreateCardStack} disabled={!groupId}>
        Add Card Stack
      </button>
      <ul>
        {cardStacks.map((stack) => (
          <li key={stack.id}>
            <a href={`/dashboard/groups/${groupId}/cardstacks/${stack.id}`}>{stack.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupDetail;
