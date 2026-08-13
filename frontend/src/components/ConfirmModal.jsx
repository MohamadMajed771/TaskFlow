function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        className="confirm-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirm-modal-actions">
          <button
            className="secondary-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="danger-button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;