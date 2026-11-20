import { coverAlt } from "@/lib/posts";
import { cloudinarySrcSet, cloudinaryUrl } from "@/lib/cloudinary";

/**
 * Cover image with branded fallback, responsive Cloudinary srcset, and
 * explicit intrinsic dimensions (3:2) to eliminate CLS.
 */
export default function CoverImage({
  src,
  slug,
  title,
  className = "h-full w-full object-cover",
  imgClassName,
  eager = false,
  defaultWidth = 1200,
  sizes = "(max-width: 768px) 100vw, 768px",
}: {
  src: string;
  slug: string;
  title: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  defaultWidth?: number;
  sizes?: string;
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
          width={64}
          height={64}
          className="h-16 w-16 opacity-90"
        />
      </div>
    );
  }
  const optimizedSrc = cloudinaryUrl(src, defaultWidth);
  const srcSet = cloudinarySrcSet(src, [480, 800, 1200]);
  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={coverAlt(slug, title)}
      width={1200}
      height={800}
      loading={eager ? "eager" : "lazy"}
      decoding={eager ? "sync" : "async"}
      fetchPriority={eager ? "high" : undefined}
      className={imgClassName ?? className}
    />
  );
}
