// リスト追加ボタンのコンポーネント

type AddListButtonProps = {
  openAddListForm: () => void;
}

export function AddListButton({ openAddListForm }: AddListButtonProps) {
  return (
    <button
      className="add-list-button"
      onClick={openAddListForm}
    >
      ＋ もう1つリストを追加
    </button>
  );
}