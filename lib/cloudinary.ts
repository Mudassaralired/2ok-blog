// Pure URL helpers for Cloudinary responsive delivery & Schema aspect-ratio crops.
// Safe to import in both Server and Client Components (no Node built-ins).

const CLD_RE = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;

/** Strip existing delivery transform segment (e.g. f_auto,q_auto,w_1200/) so we can
 *  apply a clean width/crop transform without duplicating parameters. */
function splitCloudinary(src: string): { prefix: string; publicPath: string } | null {
  const m = src.match(CLD_RE);
  if (!m) return null;
  const prefix = m[1];
  let rest = m[2];
  // Remove leading transform segments (comma/underscore tokens before version or folder)
  while (/^[a-z]{1,3}_[^/]+\//.test(rest)) {
    rest = rest.replace(/^[^/]+\//, "");
  }
  return { prefix, publicPath: rest };
}

/** Responsive width-limited Cloudinary URL with automatic format & quality. */
export function cloudinaryUrl(src: string, width: number): string {
  const parts = splitCloudinary(src);
  if (!parts) return src;
  return `${parts.prefix}w_${width},c_limit,f_auto,q_auto/${parts.publicPath}`;
}

/** Responsive srcset for Cloudinary images (pair with an explicit `sizes` attribute). */
export function cloudinarySrcSet(
  src: string,
  widths: number[] = [480, 800, 1200]
): string | undefined {
  if (!splitCloudinary(src)) return undefined;
  return widths.map((w) => `${cloudinaryUrl(src, w)} ${w}w`).join(", ");
}

/** Fixed-aspect crop for Open Graph / Schema.org ImageObject thumbnails (16:9, 4:3, 1:1). */
export function cloudinaryCrop(
  src: string,
  width: number,
  height: number
): string {
  const parts = splitCloudinary(src);
  if (!parts) return src;
  return `${parts.prefix}w_${width},h_${height},c_fill,g_auto/f_auto,q_auto/${parts.publicPath}`;
}
