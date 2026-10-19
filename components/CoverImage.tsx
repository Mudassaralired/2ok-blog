import { coverAlt } from "@/lib/posts";

/**
 * Cover image with branded fallback. When a post has no cover yet
 * (owner supplies polished images separately), renders a terracotta
 * brand placeholder instead of a broken image.
 */
export default function CoverImage({
  src,
  slug,
  title,
  className = "h-full w-full object-cover",
  imgClassName,
  eager = false,
}: {
  src: string;
  slug: string;
  title: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-clay to-clay-dark ${className}`}
        aria-label={coverAlt(slug, title)}
        role="img"
      >
        <img
          src="/logo-mark.svg"
          alt=""
          aria-hidden="true"
          className="h-16 w-16 opacity-90"
        />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={coverAlt(slug, title)}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      className={imgClassName ?? className}
    />
  );
}
