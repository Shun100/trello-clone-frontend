import { useState } from "react";
import { AddCardForm } from "./AddCardForm";
import { AddCardButton } from "./AddCardButton";
import { cardRepository } from "../../../../modules/cards/card.repository";
import type { Card } from "../../../../modules/cards/card.entity";

// カード追加コンポーネント

type AddCardProps = {
  listId: string;
}

export function AddCard({ listId }: AddCardProps) {
  const [showForm, setShowForm] = useState<boolean>(false);

  const createCard = async (title: string): Promise<Card> => {
    const newCard = await cardRepository.create(listId, title);
    return newCard;
  }

  return (
    <>
      {showForm
        ? <AddCardForm closeForm={() => setShowForm(false)} createCard={createCard}/>
        : <AddCardButton openForm={() => setShowForm(true)}/>
      }
    </>
  );
}