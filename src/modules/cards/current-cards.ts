import { atom } from "jotai";
import type { Card } from "./card.entity";

export const currentCardsAtom = atom<Card[]>([]);
export const selectedCardIdAtom = atom<string | null>(null);

export const addCardAtom = atom(
  null,
  (get, set, newCard: Card) => {
    const prev = get(currentCardsAtom);
    set(currentCardsAtom, [...prev, newCard]);
  }
);

export const updateCardAtom = atom(
  null,
  (get, set, updatedCard: Card) => {
    const prev = get(currentCardsAtom);
    set(currentCardsAtom, prev.map(card => card.id === updatedCard.id ? updatedCard : card));
  }
);

export const updateCardsAtom = atom(
  null,
  (get, set, updatedCards: Card[]) => {
    const prev = get(currentCardsAtom);
    const updateMap = new Map(updatedCards.map(card => [card.id, card]));

    const next = prev
      .map(card => {
        const updated = updateMap.get(card.id);
        return updated ?? card;
      })
      .sort((a, b) => a.position - b.position);
    
    set(currentCardsAtom, next);
  }
)

export const deleteCardAtom = atom(
  null,
  (get, set, cardId: string) => {
    const prev = get(currentCardsAtom);
    set(currentCardsAtom, prev.filter(card => card.id !== cardId));
  }
);

export const getSelectedCardAtom = atom(get => {
  const selectedCardId = get(selectedCardIdAtom);
  if (!selectedCardId) { return null; }

  return get(currentCardsAtom).find(card => card.id === selectedCardId);
});