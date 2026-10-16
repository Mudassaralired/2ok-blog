import Link from "next/link";
import { formatDate, coverAlt, type PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group overflow-hidden rounded-2xl border border-ink/10 bg-parchment transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
    >
      <div className="aspect-[16/10] overflow-hidden bg-sand">
        {/* plain <img>: next/image optimization is disabled for static export */}
        <img
          src={post.cover}
          alt={coverAlt(post.slug, post.title)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-clay-dark">
          {post.category}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight group-hover:text-clay-dark">
          {post.title}
        </h3>
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {post.excerpt}
        </p>
        <p className="mt-4 text-xs font-medium text-stone-warm">
          {formatDate(post.date)} · {post.readingTime} min read
        </p>
      </div>
    </Link>
  );
}
