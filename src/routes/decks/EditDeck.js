import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateDeck, readDeck } from "../../utils/api";

function EditDeck() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    readDeck(deckId, abortController.signal).then((d) => {
      setDeck(d);
      setName(d.name || "");
      setDescription(d.description || "");
      setLoading(false);
    });
    return () => abortController.abort();
  }, [deckId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDeck({ id: Number(deckId), name, description });
    setLoading(true);
    readDeck(deckId).then((d) => {
      setDeck(d);
      setName(d.name || "");
      setDescription(d.description || "");
      setLoading(false);
      navigate(`/decks/${deckId}`);
    });
  };

  if (loading || !deck) return <div>Loading...</div>;

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
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default EditDeck;
