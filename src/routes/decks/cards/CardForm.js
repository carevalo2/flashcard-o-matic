import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCard, readCard, updateCard } from "../../../utils/api";
import { DeckContext } from "../DeckInfo";

function CardForm({ mode = "create" }) {
  const { deckId, cardId } = useParams();
  const navigate = useNavigate();
  const { deck, refreshDeckData } = useContext(DeckContext);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = mode === "edit" || cardId;

  useEffect(() => {
    if (isEditMode && cardId) {
      const abortController = new AbortController();
      setLoading(true);
      readCard(cardId, abortController.signal)
        .then((card) => {
          setFront(card.front || "");
          setBack(card.back || "");
          setLoading(false);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Error loading card:", error);
            setLoading(false);
          }
        });
      return () => abortController.abort();
    }
  }, [cardId, isEditMode]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        await updateCard({
          id: Number(cardId),
          front,
          back,
          deckId: Number(deckId),
        });
        refreshDeckData();
        navigate(`/decks/${deckId}`);
        await createCard(deckId, { front, back });
        setFront("");
        setBack("");
        refreshDeckData();
      }
    } catch (error) {
      console.error("Error saving card:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/decks/${deckId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      {isEditMode && deck && (
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
      )}

      <h2>
        {deck ? deck.name : ""}: {isEditMode ? "Edit Card" : "Add Card"}
      </h2>

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
          onClick={handleCancel}
        >
          {isEditMode ? "Cancel" : "Done"}
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default CardForm;
