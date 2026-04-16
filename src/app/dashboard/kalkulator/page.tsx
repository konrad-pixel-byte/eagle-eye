import { getUserTier } from "@/lib/actions/subscription";
import { UpgradeGate } from "@/components/upgrade-gate";
import { KalkulatorClient } from "./calculator-client";

export default async function KalkulatorPage() {
  const userTier = await getUserTier();

  return (
    <UpgradeGate feature="bid-calculator" userTier={userTier}>
      <KalkulatorClient />
    </UpgradeGate>
  );
}
