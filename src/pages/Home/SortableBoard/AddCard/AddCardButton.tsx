type AddCardButtonProps = {
  openForm: () => void;
}

export function AddCardButton({ openForm }: AddCardButtonProps) {
  return (
    <button
      className="add-card-button"
      onClick={openForm}
    >
        ＋ カードを追加
      </button>
  );
}