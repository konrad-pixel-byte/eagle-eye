export interface Tender {
  id: string;
  external_id: string | null;
  source: 'BZP' | 'TED' | 'BAZA_KONKURENCYJNOSCI';
  title: string;
  description: string | null;
  cpv_codes: string[];
  budget_min: number | null;
  budget_max: number | null;
  currency: string;
  deadline_submission: string | null;
  deadline_questions: string | null;
  contracting_authority: string | null;
  contracting_authority_address: string | null;
  voivodeship: string | null;
  powiat: string | null;
  city: string | null;
  status: 'active' | 'expired' | 'awarded' | 'cancelled';
  ai_relevance_score: number | null;
  ai_summary: string | null;
  ai_keywords: string[] | null;
  ai_win_probability: number | null;
  source_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlertRow {
  id: string;
  tender_id: string | null;
  channel: string;
  title: string;
  body: string | null;
  read: boolean;
  sent_at: string;
  opened_at: string | null;
  tender: {
    id: string;
    title: string;
    source: string;
    voivodeship: string | null;
    deadline_submission: string | null;
  } | null;
}

export interface AdminStats {
  tenderCount: number
  bzpCount: number
  tedCount: number
  savedTenderCount: number
  userCount: number
  tierBreakdown: { free: number; basic: number; pro: number; enterprise: number }
  activePaying: number
  trialingCount: number
  pastDueCount: number
  mrrGrosze: number
  recentTenders: { id: string; title: string; source: string; created_at: string }[]
  recentUsers: { id: string; email: string; created_at: string }[]
  cronHeartbeats: {
    job_name: string
    last_run_at: string
    last_status: "ok" | "fail"
    duration_ms: number | null
    details: Record<string, unknown> | null
  }[]
}
