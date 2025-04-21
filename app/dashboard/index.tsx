"use client";

import React from "react";
import Link from "next/link";

const Dashboard = () => {
  const [groups, setGroups] = React.useState<{ id: string; name: string }[]>([]);

  const fetchGroups = async () => {
    // Fetch groups from the database
    const response = await fetch("/api/groups");
    const data = await response.json();
    setGroups(data);
  };

  React.useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    // Logic to create a new group
    const response = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "New Group" }),
    });
    if (response.ok) {
      fetchGroups();
    }
  };

  return (
    <div>
      <h1>Flashcard Groups</h1>
      <button onClick={handleCreateGroup}>+</button>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link href={`/dashboard/groups/${group.id}`}>{group.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
