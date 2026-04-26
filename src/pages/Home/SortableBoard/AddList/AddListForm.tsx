// リスト追加画面のコンポーネント

type AddListFormProps = {
  closeAddListForm: () => void;
  createList: () => Promise<void>
  setTitle: (title: string) => void;
}
export function AddListForm({ closeAddListForm, createList, setTitle }: AddListFormProps) {
  return (
    <div className="add-list-form">
      <input
        type="text"
        placeholder="リスト名を入力..."
        className="add-list-input"
        autoFocus
        onChange={e => setTitle(e.target.value)}
      />
      <div className="add-list-actions">
        <button className="add-list-submit" onClick={createList}>リストを追加</button>
        <button className="add-list-cancel" onClick={closeAddListForm}>×</button>
      </div>
    </div>
  );
}