import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { readDeck } from "../../utils/api";

function Study() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [deck, setDeck] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then((d) => {
      setDeck(d);
    });
    return () => abortController.abort();
  }, [deckId, location.key]);

  const cards = deck.cards;

  if (cards) {
    if (cards.length < 3) {
      return (
        <div className="container mt-4">
          <h2>Not enough cards.</h2>
          <p>
            You need at least 3 cards to study. There are {cards.length} cards
            in this deck.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/decks/${deckId}/cards/new`)}
          >
            Add Cards
          </button>
        </div>
      );
    }

    const handleFlip = () => setFlipped((f) => !f);
    const handleNext = () => {
      if (current + 1 < cards.length) {
        setCurrent((current) => current + 1);
        setFlipped(false);
      } else {
        if (
          window.confirm(
            "Restart cards? Click 'cancel' to return to the home page."
          )
        ) {
          setCurrent(0);
          setFlipped(false);
        } else {
          navigate("/");
        }
      }
    };

    return (
      <div className="container mt-4">
        <h2>Study: {deck.name}</h2>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              Card {current + 1} of {cards.length}
            </h5>
            <p className="card-text">
              {flipped ? cards[current].back : cards[current].front}
            </p>
            <button className="btn btn-secondary mr-2" onClick={handleFlip}>
              Flip
            </button>
            {flipped && (
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Study;
