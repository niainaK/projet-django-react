import { useState } from "react";

function usePagination(items, pageSize = 10) {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;

    return {
        currentPage,
        pageItems: items.slice(startIndex, startIndex + pageSize),
        pageSize,
        setPage,
        totalItems: items.length,
        totalPages,
    };
}

export default usePagination;
