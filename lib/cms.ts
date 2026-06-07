import { createClient } from '@/lib/supabase/server';

/**
 * Structured CMS. Admin-editable content is a set of typed fields keyed by id.
 * Pages call getContent() to read a value, falling back to the default below
 * when Supabase isn't wired or the field hasn't been edited yet.
 */

export type FieldType = 'text' | 'textarea' | 'image';

export interface ContentField {
  key: string;
  label: string;
  type: FieldType;
  group: string;
  default: string;
}

/** The registry of everything the admin can edit. Add fields here as needed. */
export const CONTENT_FIELDS: ContentField[] = [
  {
    key: 'hero.overline',
    label: 'Hero overline',
    type: 'text',
    group: 'Homepage hero',
    default: 'GCC Construction Management',
  },
  {
    key: 'hero.headline',
    label: 'Hero headline',
    type: 'textarea',
    group: 'Homepage hero',
    default: 'Where Every Project Decision Lives',
  },
  {
    key: 'hero.subhead',
    label: 'Hero sub-headline',
    type: 'textarea',
    group: 'Homepage hero',
    default:
      'Bayty unifies your entire construction project lifecycle — verified stakeholders, structured approvals, and a trusted marketplace — on one authorised platform.',
  },
  {
    key: 'hero.image',
    label: 'Hero background image (optional)',
    type: 'image',
    group: 'Homepage hero',
    default: '',
  },
  {
    key: 'contact.email',
    label: 'Public contact email',
    type: 'text',
    group: 'Global',
    default: 'info@baytyai.com',
  },
];

const DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_FIELDS.map((f) => [f.key, f.default]),
);

/** Read one content value (server-side), with fallback to the registry default. */
export async function getContent(key: string): Promise<string> {
  const fallback = DEFAULTS[key] ?? '';
  const supabase = await createClient();
  if (!supabase) return fallback;

  const { data } = await supabase.from('site_content').select('value').eq('key', key).single();

  return data?.value ?? fallback;
}

/** Read all content values as a map (server-side), merged over defaults. */
export async function getAllContent(): Promise<Record<string, string>> {
  const supabase = await createClient();
  if (!supabase) return { ...DEFAULTS };

  const { data } = await supabase.from('site_content').select('key, value');
  const map = { ...DEFAULTS };
  for (const row of data ?? []) {
    if (row.key) map[row.key] = row.value ?? '';
  }
  return map;
}
