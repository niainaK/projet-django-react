function Pagination({
    currentPage,
    onPageChange,
    pageSize,
    totalItems,
    totalPages,
}) {
    if (totalPages <= 1) {
        return null;
    }

    const firstItem = (currentPage - 1) * pageSize + 1;
    const lastItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 border-top px-3 py-3">
            <span className="small text-muted" aria-live="polite">
                Affichage de {firstItem} à {lastItem} sur {totalItems}
            </span>

            <nav aria-label="Pagination">
                <div className="btn-group btn-group-sm" role="group">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Précédent
                    </button>
                    <span className="btn btn-outline-secondary disabled" aria-current="page">
                        Page {currentPage} sur {totalPages}
                    </span>
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Suivant
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default Pagination;
