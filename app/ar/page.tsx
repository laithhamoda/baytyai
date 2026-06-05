import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "بيتي — منصة إدارة مشاريع البناء في الإمارات والخليج" },
  description:
    "منصة إدارة مشاريع البناء الموثّقة لمطوّري الإمارات والخليج. أصحاب مصلحة موثّقون، اعتمادات منظّمة، مركز مستندات، وسوق مهنيين موثوق.",
  alternates: {
    canonical: "https://www.baytyai.com/ar",
    languages: {
      en: "https://www.baytyai.com",
      ar: "https://www.baytyai.com/ar",
      "ar-AE": "https://www.baytyai.com/ar",
      "x-default": "https://www.baytyai.com",
    },
  },
};

export default function ArabicLanding() {
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        backgroundColor: "#0A1628",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "160px 24px 120px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono, 'DM Mono', monospace)",
          fontSize: "11px",
          letterSpacing: "0.25em",
          color: "#C9A84C",
          marginBottom: "28px",
        }}
      >
        إدارة مشاريع البناء — الخليج
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
          fontWeight: 300,
          fontSize: "clamp(32px, 5vw, 56px)",
          lineHeight: 1.3,
          color: "#F8F6F1",
          maxWidth: "760px",
          marginBottom: "24px",
        }}
      >
        حيث يعيش كل قرار في مشروعك
      </h1>
      <p
        style={{
          fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
          fontWeight: 300,
          fontSize: "18px",
          lineHeight: 1.9,
          color: "rgba(248,246,241,0.65)",
          maxWidth: "560px",
          marginBottom: "48px",
        }}
      >
        تجمع بيتي دورة حياة مشروع البناء بالكامل — أصحاب مصلحة موثّقون، اعتمادات
        منظّمة، وسوق موثوق — على منصة واحدة معتمدة في الإمارات والخليج. تُطلق
        الواجهة العربية الكاملة في الربع الأخير من 2026.
      </p>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
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
            fontSize: "14px",
            letterSpacing: "0.04em",
            borderRadius: 0,
          }}
        >
          اطلب وصولاً خاصاً
        </Link>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: "56px",
            padding: "0 36px",
            backgroundColor: "transparent",
            color: "#C9A84C",
            border: "0.5px solid #C9A84C",
            fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 400,
            fontSize: "14px",
            letterSpacing: "0.04em",
            borderRadius: 0,
          }}
        >
          English
        </Link>
      </div>
    </div>
  );
}
