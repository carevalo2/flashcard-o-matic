import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateDeck } from "../../utils/api";
import { DeckContext } from "./DeckInfo";

function EditDeck() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { deck, refreshDeckData } = useContext(DeckContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (deck) {
      setName(deck.name || "");
      setDescription(deck.description || "");
    }
  }, [deck]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDeck({ id: Number(deckId), name, description });
      refreshDeckData();
      navigate(`/decks/${deckId}`);
    } catch (error) {
      console.error("Error updating deck:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!deck) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Deck</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-control"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default EditDeck;
