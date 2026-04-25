type UserInfoProps = {
  name: string,
  showForm: () => void
}

export const UserInfo = ({ name, showForm }: UserInfoProps) => {
  return (
    <div className="sidebar-user-info">
      <div className="sidebar-user-name" title="プロフィールを編集">
        {name}
      </div>
      <button
        className="sidebar-edit-button"
        title="プロフィールを編集"
        onClick={showForm}
      >
        ✏️
      </button>
    </div>
  );
}