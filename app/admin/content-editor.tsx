"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { saveContent, uploadMedia } from "./actions";
import type { ContentField } from "@/lib/cms";

const GOLD = "#C9A84C";
const sans = "var(--font-body, 'DM Sans', system-ui, sans-serif)";
const mono = "var(--font-mono, 'DM Mono', monospace)";

export default function ContentEditor({
  fields,
  values,
}: {
  fields: ContentField[];
  values: Record<string, string>;
}) {
  const [state, setState] = useState<Record<string, string>>(values);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);

  const groups = Array.from(new Set(fields.map((f) => f.group)));

  function setField(key: string, value: string) {
    setState((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  async function handleUpload(key: string, file: File) {
    setError("");
    setUploading(key);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const { url } = await uploadMedia(fd);
      setField(key, url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(null);
    }
  }

  function handleSave() {
    setError("");
    const fd = new FormData();
    for (const f of fields) fd.set(f.key, state[f.key] ?? "");
    startTransition(async () => {
      try {
        await saveContent(fd);
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed.");
      }
    });
  }

  return (
    <div>
      {groups.map((group) => (
        <section key={group} style={{ marginBottom: "48px" }}>
          <h2
            style={{
              fontFamily: mono,
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: "24px",
              paddingBottom: "10px",
              borderBottom: "0.5px solid rgba(201,168,76,0.2)",
            }}
          >
            {group}
          </h2>

          {fields.filter((f) => f.group === group).map((f) => (
            <div key={f.key} style={{ marginBottom: "28px" }}>
              <label htmlFor={f.key} style={labelStyle}>{f.label}</label>

              {f.type === "text" && (
                <input
                  id={f.key}
                  value={state[f.key] ?? ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  style={inputStyle}
                />
              )}

              {f.type === "textarea" && (
                <textarea
                  id={f.key}
                  rows={3}
                  value={state[f.key] ?? ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  style={{ ...inputStyle, height: "auto", paddingTop: "12px", resize: "vertical", lineHeight: 1.6 }}
                />
              )}

              {f.type === "image" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {state[f.key] ? (
                    <div style={{ position: "relative", width: "200px", height: "120px", border: "0.5px solid rgba(201,168,76,0.3)" }}>
                      <Image src={state[f.key]} alt={f.label} fill style={{ objectFit: "cover" }} unoptimized />
                    </div>
                  ) : (
                    <p style={{ fontFamily: sans, fontSize: "12px", color: "rgba(248,246,241,0.4)" }}>No image set.</p>
                  )}
                  <input
                    id={f.key}
                    type="file"
                    accept="image/*"
                    onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUpload(f.key, file); }}
                    style={{ fontFamily: sans, fontSize: "12px", color: "rgba(248,246,241,0.6)" }}
                  />
                  {uploading === f.key && <span style={{ fontFamily: mono, fontSize: "10px", color: GOLD }}>Uploading…</span>}
                  {state[f.key] && (
                    <button type="button" onClick={() => setField(f.key, "")} style={{ alignSelf: "flex-start", background: "none", border: "none", color: "rgba(248,246,241,0.5)", fontSize: "12px", textDecoration: "underline", cursor: "pointer" }}>
                      Remove image
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: "20px", borderTop: "0.5px solid rgba(201,168,76,0.2)", paddingTop: "28px" }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          style={{
            height: "52px",
            padding: "0 36px",
            backgroundColor: GOLD,
            color: "#0A1628",
            border: "none",
            borderRadius: 0,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: "13px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: pending ? "wait" : "pointer",
            opacity: pending ? 0.7 : 1,
          }}
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {saved && <span style={{ fontFamily: mono, fontSize: "11px", color: GOLD }}>Saved and published.</span>}
        {error && <span role="alert" style={{ fontFamily: sans, fontSize: "13px", color: "#C87878" }}>{error}</span>}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "10px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(248,246,241,0.5)",
  marginBottom: "8px",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "48px",
  backgroundColor: "#0F1E35",
  border: "0.5px solid rgba(201,168,76,0.25)",
  borderRadius: 0,
  color: "#F8F6F1",
  fontFamily: sans,
  fontWeight: 300,
  fontSize: "15px",
  padding: "12px 14px",
  outline: "none",
};
