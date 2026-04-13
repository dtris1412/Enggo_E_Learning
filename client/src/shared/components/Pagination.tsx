import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Build the URL for a given page number, preserving other query params */
  buildPageUrl: (page: number) => string;
  /** Optional side-effect callback (e.g. scroll to top) */
  onPageChange?: (page: number) => void;
  className?: string;
}

/**
 * SEO-friendly URL-based pagination component.
 * - Renders real <a> tags via React Router <Link> for crawler traversal
 * - Injects <link rel="prev"> / <link rel="next"> into <head>
 * - Smart window with ellipsis, first/last page always visible
 * - ARIA attributes for accessibility
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  buildPageUrl,
  onPageChange,
  className = "",
}) => {
  const location = useLocation();

  // Inject rel="prev" / rel="next" link tags for search engine crawlers
  useEffect(() => {
    const existing = document.querySelectorAll('link[data-pagination="true"]');
    existing.forEach((el) => el.remove());

    const base = window.location.origin;

    if (currentPage > 1) {
      const prevEl = document.createElement("link");
      prevEl.rel = "prev";
      prevEl.href = base + buildPageUrl(currentPage - 1);
      prevEl.dataset.pagination = "true";
      document.head.appendChild(prevEl);
    }

    if (currentPage < totalPages) {
      const nextEl = document.createElement("link");
      nextEl.rel = "next";
      nextEl.href = base + buildPageUrl(currentPage + 1);
      nextEl.dataset.pagination = "true";
      document.head.appendChild(nextEl);
    }

    return () => {
      document
        .querySelectorAll('link[data-pagination="true"]')
        .forEach((el) => el.remove());
    };
  }, [currentPage, totalPages, location.pathname]);

  if (totalPages <= 1) return null;

  /**
   * Format: [1, 2] ... [cur-1, cur, cur+1] ... [last-1, last]
   * - Start group  : pages 1–2 (always)
   * - Middle group : currentPage ± 1 (always, if not overlapping start/end)
   * - End group    : last 2 pages (always)
   * - Ellipsis     : inserted between non-adjacent groups
   */
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) {
      // Not enough pages to need grouping — show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startGroup = [1, 2];
    const endGroup = [totalPages - 1, totalPages];
    const midGroup = [currentPage - 1, currentPage, currentPage + 1].filter(
      (p) => p > 2 && p < totalPages - 1,
    );

    const all = new Set([...startGroup, ...midGroup, ...endGroup]);
    const sorted = Array.from(all).sort((a, b) => a - b);

    const result: (number | "...")[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
      result.push(sorted[i]);
    }
    return result;
  };

  const pages = getPageNumbers();

  const handleClick = (page: number) => {
    onPageChange?.(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Phân trang"
      className={`flex justify-center items-center gap-5 flex-wrap ${className}`}
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          to={buildPageUrl(currentPage - 1)}
          onClick={() => handleClick(currentPage - 1)}
          rel="prev"
          aria-label="Trang trước"
          className="text-slate-400 hover:text-violet-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="text-slate-200 cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="text-sm text-slate-300 select-none tracking-widest"
            aria-hidden="true"
          >
            ···
          </span>
        ) : (
          <Link
            key={page}
            to={buildPageUrl(page)}
            onClick={() => handleClick(page)}
            aria-label={`Trang ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={
              currentPage === page
                ? "text-base font-semibold text-violet-600 border-b-2 border-violet-600 pb-0.5 pointer-events-none"
                : "text-base font-medium text-slate-500 hover:text-violet-600 transition-colors pb-0.5 border-b-2 border-transparent hover:border-violet-300"
            }
          >
            {page}
          </Link>
        ),
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          to={buildPageUrl(currentPage + 1)}
          onClick={() => handleClick(currentPage + 1)}
          rel="next"
          aria-label="Trang tiếp"
          className="text-slate-400 hover:text-violet-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="text-slate-200 cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </span>
      )}
    </nav>
  );
};

export default Pagination;
