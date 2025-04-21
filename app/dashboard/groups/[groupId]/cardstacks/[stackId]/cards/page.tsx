// filepath: c:\Projects\flashy\app\dashboard\groups\[groupId]\cardstacks\[stackId]\cards\page.tsx
"use client";

import { useEffect, useState } from "react";

interface Card {
  id: string;
  frontText: string;
  backText: string;
}

const CardsPage = ({ params }: { params: { groupId: string; stackId: string } }) => {
  const { groupId, stackId } = params;
  const [cards, setCards] = useState<Card[]>([]);
  const [newFrontText, setNewFrontText] = useState("");
  const [newBackText, setNewBackText] = useState("");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}/cardstacks/${stackId}/cards`);
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error("Failed to fetch cards:", error);
      }
    };

    fetchCards();
  }, [groupId, stackId]);

  const handleAddCard = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/cardstacks/${stackId}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frontText: newFrontText, backText: newBackText }),
      });
      if (response.ok) {
        const newCard = await response.json();
        setCards((prevCards) => [...prevCards, newCard]);
        setNewFrontText("");
        setNewBackText("");
      }
    } catch (error) {
      console.error("Failed to add card:", error);
    }
  };

  return (
    <div>
      <h1>Cards in Stack {stackId}</h1>
      <ul>
        {cards.map((card) => (
          <li key={card.id}>
            <a href={`/dashboard/groups/${groupId}/cardstacks/${stackId}/cards/${card.id}`}>
              {card.frontText}
            </a>
          </li>
        ))}
      </ul>
      <div>
        <h2>Add a New Card</h2>
        <input
          type='text'
          placeholder='Front Text'
          value={newFrontText}
          onChange={(e) => setNewFrontText(e.target.value)}
        />
        <input
          type='text'
          placeholder='Back Text'
          value={newBackText}
          onChange={(e) => setNewBackText(e.target.value)}
        />
        <button onClick={handleAddCard}>Add Card</button>
      </div>
    </div>
  );
};

export default CardsPage;
