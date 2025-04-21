"use client";

import { useState } from "react";
import { useRouter } from "next/router";

const Card = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { groupId, stackId, cardId } = router.query;

  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFrontChange = (e) => {
    setFrontText(e.target.value);
  };

  const handleBackChange = (e) => {
    setBackText(e.target.value);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div>
      <h1>Card {cardId}</h1>
      <div
        onClick={toggleFlip}
        style={{
          cursor: "pointer",
          border: "1px solid black",
          padding: "20px",
          textAlign: "center",
        }}
      >
        {isFlipped ? backText : frontText}
      </div>
      <input type='text' placeholder='Front Text' value={frontText} onChange={handleFrontChange} />
      <input type='text' placeholder='Back Text' value={backText} onChange={handleBackChange} />
    </div>
  );
};

export default Card;
