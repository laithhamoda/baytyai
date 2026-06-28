import { impersonateRoleAction, returnToAdminAction } from '@/app/actions/dev/impersonate';
import { isAllowlistedAdmin } from '@/lib/auth/admin-allowlist';
import { IMPERSONATION_ROLES } from '@/lib/auth/impersonation-config';
import { isImpersonationEnvEnabled } from '@/lib/auth/impersonation-gate';
import { resolveStashedFounder } from '@/lib/auth/impersonation-session';
import { createClient } from '@/lib/supabase/server';

/**
 * Founder-only role switcher (Phase 4) — dev/preview only.
 *
 * Renders nothing unless:
 *   - the environment gate is on (Layer 1), AND
 *   - the viewer is either the allowlisted founder (live session) OR is already
 *     impersonating with a valid stashed founder identity.
 *
 * Because the whole module is behind the env gate, it is dead code in
 * production builds where NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION is unset.
 *
 * See docs/adr/0001-admin-role-impersonation.md.
 */
export default async function ImpersonationSwitcher() {
  if (!isImpersonationEnvEnabled()) return null;

  const supabase = await createClient();
  let liveEmail: string | null = null;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    liveEmail = user?.email ?? null;
  }

  const isFounder = isAllowlistedAdmin(liveEmail);
  const stashed = isFounder ? null : await resolveStashedFounder();
  if (!isFounder && !stashed) return null;

  const impersonating = !isFounder && !!stashed;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9999,
        backgroundColor: '#0A1628',
        border: '0.5px solid #C9A84C',
        padding: '14px 16px',
        maxWidth: '260px',
        fontFamily: 'system-ui, sans-serif',
        color: '#F8F6F1',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <p
        style={{
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: '10px',
        }}
      >
        Role preview {impersonating ? '· active' : ''}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {IMPERSONATION_ROLES.map((role) => (
          <form key={role} action={impersonateRoleAction}>
            <input type="hidden" name="role" value={role} />
            <button
              type="submit"
              style={{
                fontSize: '11px',
                letterSpacing: '0.06em',
                textTransform: 'capitalize',
                color: '#0A1628',
                backgroundColor: '#C9A84C',
                border: 'none',
                padding: '6px 10px',
                cursor: 'pointer',
              }}
            >
              {role}
            </button>
          </form>
        ))}
      </div>

      {impersonating && (
        <form action={returnToAdminAction} style={{ marginTop: '10px' }}>
          <button
            type="submit"
            style={{
              width: '100%',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              backgroundColor: 'transparent',
              border: '0.5px solid #C9A84C',
              padding: '7px 10px',
              cursor: 'pointer',
            }}
          >
            Return to admin
          </button>
        </form>
      )}
    </div>
  );
}
