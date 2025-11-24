export type Variant = 'variant_a' | 'variant_b';

export type SubmissionPayload = {
  email: string;
  variant: Variant;
  locationTag?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type SubmissionRecord = SubmissionPayload & {
  id: string;
  timestamp: string;
  revealed: boolean;
};

export type TimelinePoint = {
  timestamp: string;
  variant_a: number;
  variant_b: number;
};

export type LocationStat = {
  location: string;
  count: number;
};

// Submission filters for querying
export type SubmissionFilters = {
  variant?: Variant;
  startDate?: string;
  endDate?: string;
  locationTag?: string;
  limit?: number;
  offset?: number;
};

// QR Source type for tracking where submission came from
export type QRSource = 'safe' | 'malicious';

// Form data for submissions
export type SubmissionFormData = {
  email: string;
};

// TODO: I will keep expanding these types as we lock the Supabase schema down.
