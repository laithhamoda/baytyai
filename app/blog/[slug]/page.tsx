import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost, type Block } from "@/content/posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: { absolute: "Article Not Found — Bayty" } };
  return {
    title: { absolute: `${post.title} — Bayty` },
    description: post.description,
    alternates: { canonical: `https://www.baytyai.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://www.baytyai.com/blog/${post.slug}`,
    },
  };
}

function renderBlock(block: Block, i: number) {
  if (block.type === "h2") {
    return (
      <h2
        key={i}
        style={{
          fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
          fontWeight: 600,
          fontSize: "28px",
          lineHeight: 1.25,
          color: "#F8F6F1",
          margin: "48px 0 18px",
        }}
      >
        {block.text}
      </h2>
    );
  }
  if (block.type === "ul") {
    return (
      <ul key={i} style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {block.items.map((item) => (
          <li key={item} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ color: "#C9A84C", fontSize: "12px", marginTop: "4px", flexShrink: 0 }}>✦</span>
            <span
              style={{
                fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                fontWeight: 300,
                fontSize: "16px",
                lineHeight: 1.75,
                color: "rgba(248,246,241,0.75)",
              }}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p
      key={i}
      style={{
        fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
        fontWeight: 300,
        fontSize: "16px",
        lineHeight: 1.85,
        color: "rgba(248,246,241,0.75)",
        marginBottom: "24px",
      }}
    >
      {block.text}
    </p>
  );
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Bayty Technologies" },
    publisher: {
      "@type": "Organization",
      name: "Bayty Technologies",
      logo: { "@type": "ImageObject", url: "https://www.baytyai.com/logo.png" },
    },
    mainEntityOfPage: `https://www.baytyai.com/blog/${post.slug}`,
    keywords: post.keyword,
  };

  return (
    <div style={{ backgroundColor: "#0A1628", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article style={{ maxWidth: "720px", margin: "0 auto", padding: "160px 24px 120px" }}>
        <Link
          href="/blog"
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#C9A84C",
          }}
        >
          ← Insights
        </Link>

        <p
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(248,246,241,0.4)",
            margin: "32px 0 16px",
          }}
        >
          {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {post.readingMinutes} min read
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: "clamp(32px, 5vw, 48px)",
            lineHeight: 1.12,
            color: "#F8F6F1",
            marginBottom: "12px",
          }}
        >
          {post.title}
        </h1>

        <div style={{ width: "60px", height: "0.5px", backgroundColor: "#C9A84C", margin: "32px 0 48px", opacity: 0.6 }} />

        {post.body.map((block, i) => renderBlock(block, i))}

        {/* CTA */}
        <div style={{ marginTop: "64px", borderTop: "0.5px solid rgba(201,168,76,0.2)", paddingTop: "40px" }}>
          <Link
            href="/request-access"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "56px",
              padding: "0 36px",
              backgroundColor: "#C9A84C",
              color: "#0A1628",
              fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
              fontWeight: 500,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: 0,
            }}
          >
            Request Private Access →
          </Link>
        </div>
      </article>
    </div>
  );
}
