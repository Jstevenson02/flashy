"use client";

import React, { useEffect, useState } from "react";

interface Card {
  id: string;
  frontText: string;
  backText: string;
}

const CardsIndex = ({ params }: { params: Promise<{ groupId: string; stackId: string }> }) => {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [stackId, setStackId] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [newFrontText, setNewFrontText] = useState("");
  const [newBackText, setNewBackText] = useState("");
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({}); // Track flipped state for each card

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params; // Unwrap the Promise
      setGroupId(resolvedParams.groupId);
      setStackId(resolvedParams.stackId);
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchCards = async () => {
      if (groupId && stackId) {
        try {
          const response = await fetch(`/api/groups/${groupId}/cardstacks/${stackId}/cards`);
          const data = await response.json();
          setCards(data);
        } catch (error) {
          console.error("Failed to fetch cards:", error);
        }
      }
    };

    fetchCards();
  }, [groupId, stackId]);

  const handleAddCard = async () => {
    try {
      if (!groupId || !stackId) return;
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

  const toggleCard = (cardId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId], // Toggle the flipped state of the card
    }));
  };

  return (
    <div>
      <h1>Cards in Stack {stackId || "Loading..."}</h1>
      <ul>
        {cards.map((card) => (
          <li key={card.id} onClick={() => toggleCard(card.id)} style={{ cursor: "pointer" }}>
            {flippedCards[card.id] ? (
              <div>
                <strong>Back:</strong> {card.backText}
              </div>
            ) : (
              <div>
                <strong>Front:</strong> {card.frontText}
              </div>
            )}
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
        <button onClick={handleAddCard} disabled={!groupId || !stackId}>
          Add Card
        </button>
      </div>
    </div>
  );
};

export default CardsIndex;
