import { CONTENT_FIELDS, getAllContent } from '@/lib/cms';

import ContentEditor from './content-editor';

export default async function AdminContentPage() {
  const values = await getAllContent();
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
          fontWeight: 300,
          fontSize: '40px',
          color: '#F8F6F1',
          marginBottom: '8px',
        }}
      >
        Site content
      </h1>
      <p
        style={{
          fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
          fontWeight: 300,
          fontSize: '14px',
          color: 'rgba(248,246,241,0.55)',
          marginBottom: '40px',
        }}
      >
        Edit the text and images shown on the public site. Changes publish immediately.
      </p>

      {!configured && (
        <p
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: '#C9A84C',
            border: '0.5px solid rgba(201,168,76,0.4)',
            padding: '14px 18px',
            marginBottom: '32px',
          }}
        >
          Backend not connected. Add your Supabase keys in the environment to enable saving.
        </p>
      )}

      <ContentEditor fields={CONTENT_FIELDS} values={values} />
    </div>
  );
}
