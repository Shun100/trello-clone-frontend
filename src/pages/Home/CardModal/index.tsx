export const CardModal = () => {
  return (
    <div className="card-modal-overlay">
      <div className="card-modal" onClick={e => e.stopPropagation()}>
        <div className="card-modal-header">
          <div className="card-modal-list-info">
            <button className="card-modal-save-button" title="変更を保存">
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
            <button className="card-modal-header-button" title="削除">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
            <button className="card-modal-close">x</button>
          </div>
        </div>

        <div className="card-modal-content">
          <div className="card-modal-main">
            <div className="card-modal-title-section">
              <input type="checkbox" className="card-modal-title-checkbox" />
              <textarea
                placeholder="タイトルを入力"
                className="card-modal-title"
                maxLength={50}
              ></textarea>
            </div>
            <div className="card-modal-section">
              <div className="card-modal-section-header">
                <h3 className="card-modal-section-title">
                  <span className="card-modal-section-icon">🕒</span>
                  期限
                </h3>
              </div>
              <input type="date" className="card-modal-due-date" />
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
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}