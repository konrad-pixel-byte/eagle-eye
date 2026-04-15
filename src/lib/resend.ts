import { Resend } from "resend";

// Lazy init — avoid crash at build time when env vars aren't set
let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not configured");
    _resend = new Resend(key);
  }
  return _resend;
}

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ??
  "Eagle Eye <noreply@eagle-eye.hatedapps.pl>";
