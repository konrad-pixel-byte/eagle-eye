"use client";

import * as React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  canAccessFeature,
  getRequiredTierForFeature,
  getTierLabel,
  type SubscriptionTier,
} from "@/lib/subscription";

interface UpgradeGateProps {
  children: React.ReactNode;
  feature: string;
  userTier: SubscriptionTier;
  fallback?: React.ReactNode;
}

function DefaultUpgradeCard({ feature }: { feature: string }) {
  const requiredTier = getRequiredTierForFeature(feature);
  const tierLabel = getTierLabel(requiredTier);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800/70 bg-zinc-900/50 px-8 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-zinc-700/60 bg-zinc-800/60">
        <Lock className="size-5 text-zinc-400" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-zinc-300">
        Dostępne w planie{" "}
        <span className="font-mono font-semibold text-zinc-100">
          {tierLabel}+
        </span>
      </p>
      <p className="mt-1.5 max-w-xs text-xs text-zinc-500">
        Odblokuj tę funkcję, przechodząc na wyższy plan subskrypcji.
      </p>
      <Link
        href="/dashboard/ustawienia"
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "mt-6",
        })}
      >
        Przejdź na wyższy plan
      </Link>
    </div>
  );
}

export function UpgradeGate({
  children,
  feature,
  userTier,
  fallback,
}: UpgradeGateProps) {
  if (canAccessFeature(userTier, feature)) {
    return <>{children}</>;
  }

  return <>{fallback ?? <DefaultUpgradeCard feature={feature} />}</>;
}
