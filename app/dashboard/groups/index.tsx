"use client";

import React from "react";
import { useRouter } from "next/router";

const GroupsPage = () => {
  const router = useRouter();
  const [groups, setGroups] = React.useState<{ id: string; name: string }[]>([]);

  React.useEffect(() => {
    // Fetch groups from the database
    const fetchGroups = async () => {
      const response = await fetch("/api/groups");
      const data = await response.json();
      setGroups(data);
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    const newGroup = prompt("Enter new group name:");
    if (newGroup) {
      await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newGroup }),
      });
      // Refresh the groups list
      const response = await fetch("/api/groups");
      const data = await response.json();
      setGroups(data);
    }
  };

  return (
    <div>
      <h1>Flashcard Groups</h1>
      <button onClick={handleCreateGroup}>+</button>
      <ul>
        {groups.map((group) => (
          <li key={group.id} onClick={() => router.push(`/dashboard/groups/${group.id}`)}>
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsPage;
