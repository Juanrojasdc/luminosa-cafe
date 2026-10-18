function ConfirmDelete({
  itemName = "cet élément",
  onConfirm,
  onCancel,
  isDeleting = false,
}) {
  function handleConfirm() {
    if (typeof onConfirm === "function" && !isDeleting) {
      onConfirm();
    }
  }

  return (
    <section
      className="confirm-delete"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
    >
      <h3 id="confirm-delete-title">Supprimer cet élément ?</h3>

      <p id="confirm-delete-description">
        Vous êtes sur le point de supprimer « {itemName} ». Cette action est
        définitive.
      </p>

      <div className="confirm-delete__actions">
        <button
          type="button"
          className="confirm-delete__cancel"
          onClick={onCancel}
          disabled={isDeleting}
        >
          Annuler
        </button>

        <button
          type="button"
          className="confirm-delete__confirm"
          onClick={handleConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? "Suppression..." : "Supprimer"}
        </button>
      </div>
    </section>
  );
}

export default ConfirmDelete;
