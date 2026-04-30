import { useAtomValue, useSetAtom } from "jotai";
import { addCardAtom, deleteCardAtom, getSelectedCardAtom, selectedCardIdAtom, updateCardAtom } from "../../../modules/cards/current-cards";
import { useState } from "react";
import * as dateUtil from "../../../utils/dateUtil";
import { cardRepository } from "../../../modules/cards/card.repository";

export const CardModal = () => {
  const selectedCardId = useAtomValue(selectedCardIdAtom);
  if (selectedCardId === null) {
    throw new Error('Card ID is null');
  }

  const selectedCard = useAtomValue(getSelectedCardAtom);
  if (selectedCard === undefined || selectedCard === null) {
    throw new Error('Card is undefined of null');
  }

  const setSelectedCardId = useSetAtom(selectedCardIdAtom);
  const updateCard = useSetAtom(updateCardAtom);
  const deleteCard = useSetAtom(deleteCardAtom);

  // 画面を閉じるまではPropsは変わらないため、useEffectは不要
  const [title, setTitle] = useState<string>(selectedCard!.title);
  const [dueDate, setDueDate] = useState<string>(selectedCard!.dueDate ? dateUtil.format(selectedCard!.dueDate) : '');
  const [desc, setDesc] = useState<string>(selectedCard!.description ?? '');
  const [isCompleted, setIsCompleted] = useState<boolean>(selectedCard!.completed);

  const closeModal = () => setSelectedCardId(null);

  const updateCardRepository = async() => {
    const card = structuredClone(selectedCard);
    card.title = title;
    card.dueDate = new Date(dueDate);
    card.description = desc;
    card.completed = isCompleted;

    try {
      await cardRepository.update([card]);
      updateCard(card);
    } catch (error) {
      console.error(error);
    }
  }

  const deleteCardRepository = async () => {
    const confirmMessage = '削除しますか？';
    try {
      if (window.confirm(confirmMessage)) {
        await cardRepository.delete(selectedCardId);
        deleteCard(selectedCardId);
      } 
    } catch (error) {
        console.error(error);
    }
  }

  return (
    <div className="card-modal-overlay">
      <div className="card-modal" onClick={e => e.stopPropagation()}>
        <div className="card-modal-header">
          <div className="card-modal-list-info">
            <button
              className="card-modal-save-button"
              title="変更を保存"
              onClick={() => updateCardRepository().then(() => closeModal())}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                style={{ marginRight: '6px' }}
              >
                <path d="M19 12v7H5v-7M12 3v9m4-4l-4 4-4-4" />
              </svg>
              変更を保存
            </button>
          </div>
          <div className="card-modal-header-actions">
            <button
              className="card-modal-header-button"
              title="削除"
              onClick={() => deleteCardRepository().then(() => closeModal())}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
            <button
              className="card-modal-close"
              onClick={closeModal}
            >
              x
            </button>
          </div>
        </div>

        <div className="card-modal-content">
          <div className="card-modal-main">
            <div className="card-modal-title-section">
              <input
                type="checkbox"
                className="card-modal-title-checkbox"
                checked={isCompleted}
                onChange={e => setIsCompleted(e.target.checked)}
              />
              <textarea
                placeholder="タイトルを入力"
                className="card-modal-title"
                maxLength={50}
                value={title}
                onChange={e => setTitle(e.target.value)}
              ></textarea>
            </div>
            <div className="card-modal-section">
              <div className="card-modal-section-header">
                <h3 className="card-modal-section-title">
                  <span className="card-modal-section-icon">🕒</span>
                  期限を設定してください
                </h3>
              </div>
              <input
                type="date"
                className="card-modal-due-date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>

            <div className="card-modal-section">
              <div className="card-modal-section-header">
                <h3 className="card-modal-section-title">
                  <span className="card-modal-section-icon">🕒</span>
                  説明
                </h3>
              </div>
              <textarea
                placeholder="説明を入力"
                className="card-modal-description"
                maxLength={200}
                value={desc}
                onChange={e => setDesc(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}