import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  writeImpersonationAudit,
  IMPERSONATION_AUDIT_TABLE,
  type AuditInsertClient,
  type ImpersonationAuditEntry,
} from './impersonation-audit';

const baseEntry: ImpersonationAuditEntry = {
  requestedBy: 'user-123',
  requesterEmail: 'info@baytyai.com',
  targetRole: 'owner',
  sourceIp: '203.0.113.7',
  userAgent: 'vitest',
  result: 'granted',
};

function makeClient(insert: (rows: Record<string, unknown>) => Promise<{ error: { message: string } | null }>): AuditInsertClient {
  return { from: vi.fn(() => ({ insert })) };
}

describe('Layer 4 — impersonation audit log', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes a row to the audit table and returns true', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const client = makeClient(insert);

    const ok = await writeImpersonationAudit(client, baseEntry);

    expect(ok).toBe(true);
    expect(client.from).toHaveBeenCalledWith(IMPERSONATION_AUDIT_TABLE);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        requested_by: 'user-123',
        requester_email: 'info@baytyai.com',
        target_role: 'owner',
        source_ip: '203.0.113.7',
        user_agent: 'vitest',
        result: 'granted',
        detail: null,
      }),
    );
  });

  it('maps missing optional fields to null', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const client = makeClient(insert);

    await writeImpersonationAudit(client, { targetRole: 'viewer', result: 'denied' });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        requested_by: null,
        requester_email: null,
        target_role: 'viewer',
        source_ip: null,
        user_agent: null,
        result: 'denied',
        detail: null,
      }),
    );
  });

  it('returns false (and does not throw) when client is null', async () => {
    await expect(writeImpersonationAudit(null, baseEntry)).resolves.toBe(false);
  });

  it('returns false when the insert reports an error', async () => {
    const insert = vi.fn().mockResolvedValue({ error: { message: 'rls denied' } });
    await expect(writeImpersonationAudit(makeClient(insert), baseEntry)).resolves.toBe(false);
  });

  it('returns false when the insert throws', async () => {
    const insert = vi.fn().mockRejectedValue(new Error('network'));
    await expect(writeImpersonationAudit(makeClient(insert), baseEntry)).resolves.toBe(false);
  });
});
