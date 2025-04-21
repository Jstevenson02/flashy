"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const Dashboard = () => {
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [newGroupName, setNewGroupName] = useState(""); // State for new group name

  const fetchGroups = async () => {
    // Fetch groups from the database
    const response = await fetch("/api/groups");
    const data = await response.json();
    setGroups(data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return; // Prevent empty group names
    const response = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newGroupName }),
    });
    if (response.ok) {
      setNewGroupName(""); // Clear the input field
      fetchGroups(); // Refresh the group list
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    const response = await fetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId)); // Update UI
    } else {
      console.error("Failed to delete group");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full viewport height
        margin: 0, // Remove any default margins
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f9f9f9", // Light background
        overflow: "hidden", // Prevent scrolling
        boxSizing: "border-box", // Ensure padding doesn't affect height
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "2rem", color: "#333" }}>Flashcard Groups</h1>

      {/* Input for New Group Name */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
        <input
          type='text'
          placeholder='Enter group name'
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginRight: "10px",
            width: "200px",
          }}
        />
        <button
          onClick={handleCreateGroup}
          style={{
            padding: "10px 15px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Group
        </button>
      </div>

      {/* List of Groups */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          width: "100%",
          maxWidth: "400px",
          overflowY: "auto", // Allow scrolling only for the group list if needed
          maxHeight: "60vh", // Limit the height of the group list
        }}
      >
        {groups.map((group) => (
          <li
            key={group.id}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link
              href={`/dashboard/groups/${group.id}`}
              style={{
                textDecoration: "none",
                color: "blue",
                fontWeight: "bold",
                flex: 1,
              }}
            >
              {group.name}
            </Link>
            <button
              onClick={() => handleDeleteGroup(group.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
                marginLeft: "10px",
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

export default Dashboard;
