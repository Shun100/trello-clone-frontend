import { useSetAtom } from "jotai";
import { useState } from "react";
import { addCardAtom } from "../../../../modules/cards/current-cards";
import type { Card } from "../../../../modules/cards/card.entity";

type AddCardFormProps = {
  closeForm: () => void;
  createCard: (title: string) => Promise<Card>;
}

export function AddCardForm({ closeForm, createCard }: AddCardFormProps) {
  const [title, setTitle] = useState('');
  const addCard = useSetAtom(addCardAtom);

  return (
    <div className="add-card-form">
      <textarea
        placeholder="タイトルを入力するか、リンクを貼り付ける"
        autoFocus
        onChange={e => setTitle(e.target.value)}
      />
      <div className="add-card-form-actions">
        <button
          type="submit"
          className="add-button"
          onClick={() => {
            createCard(title)
              .then(addCard)
              .catch(console.error)
              .finally(closeForm);
          }}
          disabled={title === ''}
        >
          カードを追加
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={closeForm}
        >
          ✖
        </button>
      </div>
    </div>
  );
}