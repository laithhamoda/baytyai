import { notFound, redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import PrintButton from './print-button';

export const metadata = { title: 'Document', robots: { index: false, follow: false } };

type DocRow = {
  doc_type: string;
  reference_no: string;
  title: string;
  status: string;
  language: 'en' | 'ar';
  fidic_clause: string | null;
  source: 'ai' | 'template';
  body: { sections: { heading: string; body: string }[] } | null;
  created_at: string;
};

function fmt(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

const PRINT_CSS = `
  @page { size: A4; margin: 20mm; }
  @media print { .no-print { display: none !important; } body { background: #fff; } }
`;

export default async function DocumentPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  if (!supabase) redirect('/sign-in');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/documents/${id}/print`);

  const { data, error } = await supabase
    .from('generated_documents')
    .select(
      'doc_type, reference_no, title, status, language, fidic_clause, source, body, created_at',
    )
    .eq('id', id)
    .single();

  if (error || !data) notFound();
  const doc = data as DocRow;
  const rtl = doc.language === 'ar';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <div className="min-h-screen bg-neutral-100 py-10 print:bg-white print:py-0">
        <article
          dir={rtl ? 'rtl' : 'ltr'}
          className="mx-auto w-full max-w-[794px] bg-white p-12 text-neutral-900 shadow-sm print:max-w-none print:p-0 print:shadow-none"
          style={{
            fontFamily: rtl ? 'var(--font-arabic), serif' : 'var(--font-display), Georgia, serif',
          }}
        >
          {/* Letterhead */}
          <header className="flex items-start justify-between border-b-2 border-[#C9A84C] pb-5">
            <div>
              <p className="text-2xl font-semibold tracking-tight text-[#0A1628]">
                Bayty<span className="italic text-[#C9A84C]">ai</span>
              </p>
              <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                Verified Project Control
              </p>
            </div>
            <div className={rtl ? 'text-left' : 'text-right'}>
              <p className="font-sans text-[11px] uppercase tracking-widest text-neutral-500">
                Reference
              </p>
              <p className="font-sans text-sm font-semibold text-[#0A1628]">{doc.reference_no}</p>
            </div>
          </header>

          {/* Title + meta */}
          <div className="mt-8">
            <h1 className="text-2xl font-semibold leading-snug text-[#0A1628]">{doc.title}</h1>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-1 font-sans text-[12px] text-neutral-600">
              <span>
                <strong className="text-neutral-500">Status:</strong> {doc.status}
              </span>
              {doc.fidic_clause && (
                <span>
                  <strong className="text-neutral-500">FIDIC 2017:</strong> Clause{' '}
                  {doc.fidic_clause}
                </span>
              )}
              <span>
                <strong className="text-neutral-500">Date:</strong> {fmt(doc.created_at)}
              </span>
              <span>
                <strong className="text-neutral-500">Drafted:</strong>{' '}
                {doc.source === 'ai' ? 'AI-assisted' : 'Template'}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="mt-8 space-y-6">
            {(doc.body?.sections ?? []).map((s, i) => (
              <section key={i}>
                <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9A84C]">
                  {s.heading}
                </h2>
                <p className="mt-2 whitespace-pre-line font-sans text-[14px] leading-relaxed text-neutral-800">
                  {s.body}
                </p>
              </section>
            ))}
          </div>

          {/* Signature block */}
          <footer className="mt-14 border-t border-neutral-200 pt-8">
            <div className="grid grid-cols-2 gap-10 font-sans text-[12px] text-neutral-600">
              <div>
                <div className="h-12 border-b border-neutral-300" />
                <p className="mt-2">Prepared by (name, position, signature)</p>
              </div>
              <div>
                <div className="h-12 border-b border-neutral-300" />
                <p className="mt-2">Approved by (name, position, signature)</p>
              </div>
            </div>
            <p className="mt-8 font-sans text-[10px] text-neutral-400">
              Generated via BaytyAI · {doc.reference_no} · This document is a draft until signed by
              an authorised signatory.
            </p>
          </footer>
        </article>
      </div>
      <PrintButton />
    </>
  );
}
