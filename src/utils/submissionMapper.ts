import type { SubmissionRecord } from '../types';

type DbSubmissionRow = {
  id: string;
  email: string;
  variant: SubmissionRecord['variant'];
  timestamp: string;
  revealed: boolean;
  location_tag: string | null;
  ip_address: string | null;
  user_agent: string | null;
};

// I convert Supabase's snake_case payloads into the camelCase shape our UI expects.
export function mapSubmissionFromDb(row: DbSubmissionRow): SubmissionRecord {
  return {
    id: row.id,
    email: row.email,
    variant: row.variant,
    timestamp: row.timestamp,
    revealed: Boolean(row.revealed),
    locationTag: row.location_tag ?? null,
    ipAddress: row.ip_address ?? null,
    userAgent: row.user_agent ?? null,
  };
}

// I guard against undefined/null collections so callers stay tidy.
export function mapSubmissionArray(rows: DbSubmissionRow[] | null): SubmissionRecord[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((row) => mapSubmissionFromDb(row));
}

