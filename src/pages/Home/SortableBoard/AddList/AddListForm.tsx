import { useState } from "react";

// リスト追加画面のコンポーネント

type AddListFormProps = {
  closeAddListForm: () => void;
  createList: (title: string) => Promise<void>;
}
export function AddListForm({ closeAddListForm, createList }: AddListFormProps) {
  const [title, setTitle] = useState<string>('');

  return (
    <div className="add-list-form">
      <input
        type="text"
        placeholder="リスト名を入力..."
        className="add-list-input"
        autoFocus
        onChange={e => setTitle(e.target.value)}
        value={title}
      />
      <div className="add-list-actions">
        <button
          className="add-list-submit"
          onClick={
            () => createList(title)
              .then(() => setTitle(''))
              .then(() => closeAddListForm())
          }>
            リストを追加
        </button>
        <button
          className="add-list-cancel"
          onClick={() => closeAddListForm()
        }>
          ×
        </button>
      </div>
    </div>
  );
}