import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  Outlet,
  useLocation,
  Link,
} from "react-router-dom";
import { deleteDeck, deleteCard, readDeck } from "../../utils/api";

function DeckInfo() {
  const location = useLocation();
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then((d) => {
      setDeck(d);
    });
    return () => abortController.abort();
  }, [deckId, location.key]);

  const handleDeleteDeck = async () => {
    if (
      window.confirm("Delete this deck? You will not be able to recover it.")
    ) {
      await deleteDeck(deckId);
      navigate("/");
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (
      window.confirm("Delete this card? You will not be able to recover it.")
    ) {
      await deleteCard(cardId);
      readDeck(deckId).then((d) => {
        setDeck(d);
      });
    }
  };

  return (
    <div className="container mt-4">
      {!location.pathname.match(/\/cards\/[0-9]+\/edit$/) && (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/decks/${deckId}`}>{deck.name}</Link>
            </li>
            {location.pathname.endsWith("/study") && (
              <li className="breadcrumb-item active" aria-current="page">
                Study
              </li>
            )}
            {location.pathname.endsWith("/edit") && (
              <li className="breadcrumb-item active" aria-current="page">
                Edit Deck
              </li>
            )}
            {location.pathname.endsWith("/cards/new") && (
              <li className="breadcrumb-item active" aria-current="page">
                Add Card
              </li>
            )}
          </ol>
        </nav>
      )}
      {!location.pathname.endsWith("/study") &&
        !location.pathname.endsWith("/edit") &&
        !location.pathname.endsWith("/cards/new") && (
          <>
            <h2>{deck.name}</h2>
            <p>{deck.description}</p>
            <div className="mb-3">
              <button
                className="btn btn-secondary mr-2"
                onClick={() => navigate(`/decks/${deckId}/edit`)}
              >
                Edit
              </button>
              <button
                className="btn btn-primary mr-2"
                onClick={() => navigate(`/decks/${deckId}/study`)}
              >
                Study
              </button>
              <button
                className="btn btn-primary mr-2"
                onClick={() => navigate(`/decks/${deckId}/cards/new`)}
              >
                Add Cards
              </button>
              <button className="btn btn-danger" onClick={handleDeleteDeck}>
                Delete
              </button>
            </div>
          </>
        )}
      {!(
        location.pathname.endsWith("/study") ||
        location.pathname.endsWith("/edit") ||
        location.pathname.endsWith("/cards/new")
      ) && (
        <>
          <h3>Cards</h3>
          {deck.cards && deck.cards.length > 0
            ? deck.cards.map((card) => (
                <div className="card mb-3" key={card.id}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p>{card.front}</p>
                      </div>
                      <div className="col-md-6">
                        <p>{card.back}</p>
                      </div>
                    </div>
                    <button
                      className="btn btn-secondary mr-2"
                      onClick={() =>
                        navigate(`/decks/${deckId}/cards/${card.id}/edit`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            : null}
        </>
      )}
      <Outlet />
    </div>
  );
}

export default DeckInfo;
