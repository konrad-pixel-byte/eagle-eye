import type { Metadata } from "next";

// Auth routes are login walls — don't let them land in search results even
// though individual pages override the title below.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
