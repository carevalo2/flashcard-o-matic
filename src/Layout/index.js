import React from "react";
import Header from "./Header";
import Home from "../routes/Home";
import Deck from "../routes/decks/Deck";
import CreateDeck from "../routes/decks/CreateDeck";
import DeckInfo from "../routes/decks/DeckInfo";
import Study from "../routes/decks/Study";
import EditDeck from "../routes/decks/EditDeck";
import EditCard from "../routes/decks/cards/EditCard";
import CreateCard from "../routes/decks/cards/CreateCard";
import NotFound from "../routes/NotFound";
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
            <Route path="cards/new" element={<CreateCard />} />
            <Route path="cards/:cardId/edit" element={<EditCard />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default Layout;
