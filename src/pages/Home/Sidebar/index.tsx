import { useAtom } from "jotai";
import { currentUserAtom } from "../../../modules/auth/current-user.state";
import { useState } from "react";
import { EditNameForm } from "./editNameForm";
import { UserInfo } from "./userInfo";
import { accountRepository } from "../../../modules/account/account.repository";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
  closeSidebar: () => void
};

export const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [name, setName] = useState(currentUser?.name ?? 'ゲスト');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const updateUserProfile = async (name: string): Promise<void> => {
    try {
      const user = await accountRepository.updateProfile(name);
      setCurrentUser(user);
      setName(user.name);
    } catch (error) {
      console.error(error);
    }
  }

  const logout = (): void => {
    setCurrentUser(undefined);
    localStorage.removeItem('token');
    navigate('/signin');
  }

  return (
    <>
      <div className="sidebar-overlay" onClick={closeSidebar}/>
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="sidebar-close-button" onClick={closeSidebar}>×</button>
          {showForm
            ? 
            <EditNameForm update={updateUserProfile} closeForm={() => setShowForm(false)}/>
            :
            <UserInfo name={name} showForm={() => setShowForm(true)} />
          }
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <button
              className="sidebar-board-item"
              onClick={logout}
            >
              <span className="sidebar-board-name">ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};