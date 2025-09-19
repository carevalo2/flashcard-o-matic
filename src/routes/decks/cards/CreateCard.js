import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCard, readDeck } from "../../../utils/api";

function CreateCard() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then((d) => {
      setDeck(d);
    });
    return () => abortController.abort();
  }, [deckId]);

  const handleSave = async (e) => {
    e.preventDefault();
    await createCard(deckId, { front, back });
    setFront("");
    setBack("");
    readDeck(deckId).then((d) => {
      setDeck(d);
    });
  };

  return (
    <div className="container mt-4">
      <h2>{deck.name}: Add Card</h2>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="front">Front</label>
          <textarea
            id="front"
            className="form-control"
            rows={3}
            value={front}
            onChange={(e) => setFront(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="back">Back</label>
          <textarea
            id="back"
            className="form-control"
            rows={3}
            value={back}
            onChange={(e) => setBack(e.target.value)}
            required
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={() => navigate(`/decks/${deckId}`)}
        >
          Done
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}

export default CreateCard;
