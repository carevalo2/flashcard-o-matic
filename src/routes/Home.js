import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listDecks, deleteDeck } from "../utils/api";

function Home() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    listDecks(abortController.signal)
      .then((data) => {
        setDecks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => abortController.abort();
  }, []);

  const handleDelete = async (deckId) => {
    if (
      window.confirm("Delete this deck? You will not be able to recover it.")
    ) {
      await deleteDeck(deckId);
      setDecks((prev) => prev.filter((d) => d.id !== deckId));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/decks/new")}
        >
          Create Deck
        </button>
      </div>
      {loading ? (
        <div>Loading decks...</div>
      ) : decks.length === 0 ? (
        <div>No decks found. Click "Create Deck" to add one.</div>
      ) : (
        decks.map((deck) => (
          <div className="card mb-3" key={deck.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">{deck.name}</h5>
                <small>{deck.cards ? deck.cards.length : 0} cards</small>
              </div>
              <p className="card-text">{deck.description}</p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/decks/${deck.id}/study`)}
                >
                  Study
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/decks/${deck.id}`)}
                >
                  View
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(deck.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
