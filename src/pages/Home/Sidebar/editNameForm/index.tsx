import { useState } from "react";

type EditNameFormProps = {
  update: (name: string) => Promise<void>,
  closeForm: () => void,
}

export const EditNameForm = ({ update, closeForm }: EditNameFormProps) => {
  const [name, setName] = useState('');

  return (
    <div className="sidebar-edit-form">
      <input
        type="text"
        placeholder="ユーザー名を入力"
        className="sidebar-name-input"
        autoFocus
        maxLength={20}
        onChange={e => setName(e.target.value)}
      />
      <div className="sidebar-edit-actions">
        <button
          className="sidebar-save-button"
          onClick={() => update(name).then(() => closeForm())}
        >
          保存
        </button>
        <button
          className="sidebar-cancel-button"
          onClick={closeForm}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}