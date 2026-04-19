import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { scoreTender, summarizeTender, generateBidAdvice } from "@/lib/ai/tender-analysis";
import type { Tender } from "@/lib/types";
import { getAiQuota, type AiEndpoint, type SubscriptionTier } from "@/lib/subscription";

// Free users get limited AI calls; paid users get unlimited
const AI_TIER_REQUIRED: Record<string, SubscriptionTier> = {
  score: "free",       // available to all
  summary: "basic",    // basic+ only
  "bid-coach": "pro",  // pro+ only
}

const TIER_ORDER: SubscriptionTier[] = ["free", "basic", "pro", "enterprise"]

function tierMeetsRequirement(userTier: SubscriptionTier, required: SubscriptionTier): boolean {
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(required)
}

interface RequestBody {
  tenderId: string;
  type: "score" | "summary" | "bid-coach";
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { tenderId, type } = body;

  if (!tenderId || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!["score", "summary", "bid-coach"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  // Check subscription tier
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single<{ subscription_tier: SubscriptionTier }>()

  const userTier: SubscriptionTier = profile?.subscription_tier ?? "free"
  const required = AI_TIER_REQUIRED[type] ?? "pro"

  if (!tierMeetsRequirement(userTier, required)) {
    return NextResponse.json(
      { error: `Ta funkcja AI wymaga planu ${required}+` },
      { status: 403 }
    )
  }

  // Enforce daily quota via atomic Postgres RPC
  const quota = getAiQuota(userTier, type as AiEndpoint);
  if (quota <= 0) {
    return NextResponse.json(
      { error: "Ta funkcja nie jest dostępna w Twoim planie" },
      { status: 403 }
    );
  }

  const admin = createAdminClient();
  const { data: usageRow, error: usageErr } = await admin.rpc("increment_ai_usage", {
    p_user_id: user.id,
    p_endpoint: type,
    p_limit: quota,
  });

  if (usageErr) {
    console.error("[analyze-tender] increment_ai_usage failed:", usageErr.message);
    return NextResponse.json({ error: "Błąd sprawdzania limitu" }, { status: 500 });
  }

  const usage = Array.isArray(usageRow) ? usageRow[0] : usageRow;
  if (!usage?.allowed) {
    return NextResponse.json(
      {
        error: `Dzienny limit osiągnięty (${quota}/${quota}). Zresetuje się jutro lub zwiększ plan.`,
        quota,
        used: usage?.new_count ?? quota,
      },
      { status: 429 }
    );
  }

  const { data: tender, error: tenderError } = await supabase
    .from("tenders")
    .select("*")
    .eq("id", tenderId)
    .single<Tender>();

  if (tenderError || !tender) {
    return NextResponse.json({ error: "Tender not found" }, { status: 404 });
  }

  if (type === "score") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("preferred_regions, preferred_cpv_codes, budget_min, budget_max")
      .eq("id", user.id)
      .single<{
        preferred_regions: string[];
        preferred_cpv_codes: string[];
        budget_min: number | null;
        budget_max: number | null;
      }>();

    const userProfile = {
      preferred_regions: profile?.preferred_regions ?? [],
      preferred_cpv_codes: profile?.preferred_cpv_codes ?? [],
      budget_min: profile?.budget_min ?? null,
      budget_max: profile?.budget_max ?? null,
    };

    const result = await scoreTender(tender, userProfile);
    if (!result) {
      return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
    }

    await supabase
      .from("tenders")
      .update({ ai_relevance_score: result.score })
      .eq("id", tenderId);

    return NextResponse.json({ result });
  }

  if (type === "summary") {
    const summary = await summarizeTender(tender);
    if (!summary) {
      return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
    }

    await supabase
      .from("tenders")
      .update({ ai_summary: summary })
      .eq("id", tenderId);

    return NextResponse.json({ result: summary });
  }

  if (type === "bid-coach") {
    const advice = await generateBidAdvice(tender);
    if (!advice) {
      return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
    }

    return NextResponse.json({ result: advice });
  }

  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
}
