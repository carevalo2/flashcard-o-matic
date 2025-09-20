import React from "react";
import Header from "./Header";
import Home from "../routes/Home";
import Deck from "../routes/decks/Deck";
import CreateDeck from "../routes/decks/CreateDeck";
import DeckInfo from "../routes/decks/DeckInfo";
import Study from "../routes/decks/Study";
import EditDeck from "../routes/decks/EditDeck";
import CardForm from "../routes/decks/cards/CardForm";
import NotFound from "./NotFound";
import { Routes, Route } from "react-router-dom";

function Layout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decks" element={<Deck />}>
          <Route path="new" element={<CreateDeck />} />
          <Route path=":deckId" element={<DeckInfo />}>
            <Route path="study" element={<Study />} />
            <Route path="edit" element={<EditDeck />} />
            <Route path="cards/new" element={<CardForm mode="create" />} />
            <Route
              path="cards/:cardId/edit"
              element={<CardForm mode="edit" />}
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default Layout;
