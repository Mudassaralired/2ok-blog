import Link from "next/link";

/**
 * Numbered pagination for listing pages (topics, categories). Page 1
 * lives at basePath itself; page n > 1 at basePath/page/n — there is
 * never a /page/1 URL, so page 1 keeps its single canonical address.
 * (The blog index uses its own copy inside BlogSearch because its nav
 * must hide while a search query is active.)
 */
export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;
  const href = (n: number) => (n <= 1 ? basePath : `${basePath}/page/${n}`);
  return (
    <nav
      aria-label="Pages"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-clay-dark"
        >
          ← Previous
        </Link>
      ) : null}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
        n === currentPage ? (
          <span
            key={n}
            aria-current="page"
            className="rounded-full bg-clay-dark px-4 py-2.5 text-sm font-semibold text-cream"
          >
            {n}
          </span>
        ) : (
          <Link
            key={n}
            href={href(n)}
            className="rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-clay-dark"
          >
            {n}
          </Link>
        )
      )}
      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-clay-dark"
        >
          Next →
        </Link>
      ) : null}
    </nav>
  );
}
