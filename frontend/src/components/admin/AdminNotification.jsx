function AdminNotification({ message, error, onCloseMessage, onCloseError }) {
  if (!message && !error) return null;

  return (
    <div className="admin-notification">
      {message && (
        <div className="admin-notification__item" role="status">
          <span>{message}</span>
          <button type="button" onClick={onCloseMessage} aria-label="Fermer la notification">
            ×
          </button>
        </div>
      )}
      {error && (
        <div className="admin-notification__item admin-notification__item--error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={onCloseError} aria-label="Fermer l’erreur">
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminNotification;
