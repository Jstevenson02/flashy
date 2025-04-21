"use client";

import { useEffect, useState } from "react";

interface GroupDetailProps {
  params: { groupId: string };
}

const GroupDetail = ({ params }: GroupDetailProps) => {
  const { groupId } = params;
  const [cardStacks, setCardStacks] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (groupId) {
      // Fetch card stacks for the specific group from the database
      const fetchCardStacks = async () => {
        const response = await fetch(`/api/groups/${groupId}/cardstacks`);
        const data = await response.json();
        setCardStacks(data);
      };

      fetchCardStacks();
    }
  }, [groupId]);

  const handleCreateCardStack = async () => {
    // Logic to create a new card stack
    const response = await fetch(`/api/groups/${groupId}/cardstacks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "New Card Stack" }), // Example payload
    });
    if (response.ok) {
      const newStack = await response.json();
      setCardStacks([...cardStacks, newStack]);
    }
  };

  return (
    <div>
      <h1>Group: {groupId}</h1>
      <button onClick={handleCreateCardStack}>Add Card Stack</button>
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
