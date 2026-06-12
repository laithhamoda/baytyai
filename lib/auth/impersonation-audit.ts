/**
 * Impersonation audit logging — Layer 4 of the four-layer security model.
 * See docs/adr/0001-admin-role-impersonation.md.
 *
 * Every impersonation attempt — whether granted, denied, or errored — is
 * recorded in `impersonation_audit_log` using the SERVICE-ROLE client so the
 * write cannot be tampered with by an impersonated (anon-key) session.
 *
 * Audit failures must never crash the caller: logging is best-effort and any
 * error is swallowed after being surfaced to the server console.
 */

export type ImpersonationResult = 'granted' | 'denied' | 'error';

export interface ImpersonationAuditEntry {
  requestedBy?: string | null;
  requesterEmail?: string | null;
  targetRole: string;
  sourceIp?: string | null;
  userAgent?: string | null;
  result: ImpersonationResult;
  detail?: string | null;
}

/**
 * Minimal structural type for the service-role Supabase client we depend on.
 * Declared locally so this module stays unit-testable without importing the
 * full Supabase types or constructing a real client.
 */
export interface AuditInsertClient {
  from(table: string): {
    insert(rows: Record<string, unknown>): Promise<{ error: { message: string } | null }>;
  };
}

export const IMPERSONATION_AUDIT_TABLE = 'impersonation_audit_log';

/**
 * Write a single audit row. Returns true on success, false on any failure.
 * Never throws.
 */
export async function writeImpersonationAudit(
  client: AuditInsertClient | null,
  entry: ImpersonationAuditEntry,
): Promise<boolean> {
  if (!client) {
    console.error('[impersonation-audit] no service-role client; entry dropped:', entry.result);
    return false;
  }

  try {
    const { error } = await client.from(IMPERSONATION_AUDIT_TABLE).insert({
      requested_by: entry.requestedBy ?? null,
      requester_email: entry.requesterEmail ?? null,
      target_role: entry.targetRole,
      source_ip: entry.sourceIp ?? null,
      user_agent: entry.userAgent ?? null,
      result: entry.result,
      detail: entry.detail ?? null,
    });

    if (error) {
      console.error('[impersonation-audit] insert failed:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[impersonation-audit] unexpected error:', err);
    return false;
  }
}
