import { CONTENT_FIELDS, getAllContent } from '@/lib/cms';

import ContentEditor from './content-editor';

export default async function AdminContentPage() {
  const values = await getAllContent();
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  return (
    <div>
      <h1 className="mb-2 font-sans text-3xl font-semibold text-ink-100">Site content</h1>
      <p className="mb-10 font-sans text-sm text-ink-300">
        Edit the text and images shown on the public site. Changes publish immediately.
      </p>

      {!configured && (
        <p className="mb-8 border border-signal-500/40 px-4 py-3.5 font-mono text-[11px] tracking-[0.08em] text-signal-500">
          Backend not connected. Add your Supabase keys in the environment to enable saving.
        </p>
      )}

      <ContentEditor fields={CONTENT_FIELDS} values={values} />
    </div>
  );
}
