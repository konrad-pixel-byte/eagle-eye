import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scoreTender, summarizeTender, generateBidAdvice } from "@/lib/ai/tender-analysis";
import type { Tender } from "@/lib/types";

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
