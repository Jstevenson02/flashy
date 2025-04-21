import React from "react";
import { useRouter } from "next/router";

const CardStacks = () => {
  const router = useRouter();
  const { groupId } = router.query;

  // Placeholder for fetching cardstacks based on groupId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cardStacks: any[] = []; // Replace with actual data fetching logic

  const handleCreateCardStack = () => {
    // Logic to create a new cardstack
  };

  return (
    <div>
      <h1>Card Stacks for Group {groupId}</h1>
      <button onClick={handleCreateCardStack}>+ Create New Card Stack</button>
      <ul>
        {cardStacks.map((stack) => (
          <li
            key={stack.id}
            onClick={() => router.push(`/dashboard/groups/${groupId}/cardstacks/${stack.id}`)}
          >
            {stack.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardStacks;
