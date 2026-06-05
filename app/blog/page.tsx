import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/content/posts";

export const metadata: Metadata = {
  title: { absolute: "Bayty Insights — GCC Construction Technology & Compliance" },
  description:
    "Guides and analysis on construction management, contractor verification, approval workflows, and compliance across the UAE and GCC.",
  alternates: { canonical: "https://www.baytyai.com/blog" },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Bayty Insights",
  url: "https://www.baytyai.com/blog",
  blogPost: POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    url: `https://www.baytyai.com/blog/${p.slug}`,
  })),
};

export default function BlogIndex() {
  return (
    <div style={{ backgroundColor: "#0A1628", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />

      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "160px 24px 120px" }}>
        <p
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "#C9A84C",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          Insights
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: "clamp(36px, 5.5vw, 56px)",
            lineHeight: 1.1,
            color: "#F8F6F1",
            marginBottom: "64px",
            maxWidth: "680px",
          }}
        >
          On construction technology, verification, and the GCC built environment
        </h1>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              style={{
                display: "block",
                borderTop: "0.5px solid rgba(201,168,76,0.2)",
                padding: "32px 0",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginBottom: "12px",
                }}
              >
                {new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {p.readingMinutes} min read
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  fontWeight: 600,
                  fontSize: "26px",
                  lineHeight: 1.2,
                  color: "#F8F6F1",
                  marginBottom: "10px",
                }}
              >
                {p.title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 300,
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "rgba(248,246,241,0.6)",
                  maxWidth: "680px",
                }}
              >
                {p.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
