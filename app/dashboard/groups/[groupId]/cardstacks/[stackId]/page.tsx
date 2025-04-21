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
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Track the current card index
  const [isFlipped, setIsFlipped] = useState(false); // Track whether the current card is flipped
  const [newFrontText, setNewFrontText] = useState("");
  const [newBackText, setNewBackText] = useState("");

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
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

  const handleDeleteCard = async (cardId: string) => {
    try {
      if (!groupId || !stackId) return;
      const response = await fetch(`/api/groups/${groupId}/cardstacks/${stackId}/cards/${cardId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
        setCurrentCardIndex((prevIndex) => Math.max(0, prevIndex - 1)); // Adjust index if necessary
      }
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prevIndex) => prevIndex + 1);
      setIsFlipped(false); // Reset flip state when moving to the next card
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prevIndex) => prevIndex - 1);
      setIsFlipped(false); // Reset flip state when moving to the previous card
    }
  };

  const toggleCardFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Cards in Stack {stackId || "Loading..."}</h1>

      {/* Card Container */}
      <div
        style={{
          width: "300px",
          height: "200px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          margin: "20px auto",
          position: "relative",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {cards.length > 0 ? (
          isFlipped ? (
            <div>{cards[currentCardIndex].backText}</div>
          ) : (
            <div>{cards[currentCardIndex].frontText}</div>
          )
        ) : (
          <div>No cards available</div>
        )}

        {/* Delete Button */}
        {cards.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCard(cards[currentCardIndex].id);
            }}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              cursor: "pointer",
            }}
          >
            X
          </button>
        )}

        {/* Previous Button */}
        {currentCardIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePreviousCard();
            }}
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              background: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            ◀
          </button>
        )}

        {/* Flip Button */}
        {cards.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCardFlip();
            }}
            style={{
              position: "absolute",
              bottom: "10px",
              background: "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Flip
          </button>
        )}

        {/* Next Button */}
        {currentCardIndex < cards.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextCard();
            }}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              background: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            ▶
          </button>
        )}
      </div>

      {/* Add Card Form */}
      <div style={{ marginTop: "20px" }}>
        <h2>Add a New Card</h2>
        <input
          type='text'
          placeholder='Front Text'
          value={newFrontText}
          onChange={(e) => setNewFrontText(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type='text'
          placeholder='Back Text'
          value={newBackText}
          onChange={(e) => setNewBackText(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button
          onClick={handleAddCard}
          disabled={!groupId || !stackId}
          style={{ padding: "5px 10px" }}
        >
          Add Card
        </button>
      </div>
    </div>
  );
};

export default CardsIndex;
