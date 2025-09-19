import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { readCard, updateCard, readDeck } from "../../../utils/api";

function EditCard() {
  const { deckId, cardId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    Promise.all([
      readDeck(deckId, abortController.signal),
      readCard(cardId, abortController.signal),
    ]).then(([d, c]) => {
      setDeck(d);
      setFront(c.front || "");
      setBack(c.back || "");
      setLoading(false);
    });
    return () => abortController.abort();
  }, [deckId, cardId]);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateCard({
      id: Number(cardId),
      front,
      back,
      deckId: Number(deckId),
    });
    setLoading(true);
    // Refetch deck/card after edit
    Promise.all([readDeck(deckId), readCard(cardId)]).then(([d, c]) => {
      setDeck(d);
      setFront(c.front || "");
      setBack(c.back || "");
      setLoading(false);
      navigate(`/decks/${deckId}`);
    });
  };

  if (loading || !deck) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href={`/decks/${deckId}`}>{deck.name}</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Edit Card {cardId}
          </li>
        </ol>
      </nav>
      <h2>{deck.name}: Edit Card</h2>
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
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}

export default EditCard;
