import { generateText } from "ai";
import { getAnthropicClient } from "./client";
import type { Tender } from "@/lib/types";

interface UserProfile {
  preferred_regions: string[];
  preferred_cpv_codes: string[];
  budget_min: number | null;
  budget_max: number | null;
}

interface ScoreResult {
  score: number;
  reason: string;
}

export async function scoreTender(
  tender: Tender,
  userProfile: UserProfile
): Promise<ScoreResult | null> {
  try {
    const anthropic = getAnthropicClient();
    const { text } = await generateText({
      model: anthropic("claude-haiku-4-5"),
      prompt: `You are an AI assistant for Eagle Eye, a Polish training tender monitoring platform. Score how relevant this tender is for the user (0-100). Consider: CPV code match, region match, budget match, keyword match. Return ONLY a JSON object: {"score": number, "reason": string}

Tender:
- Title: ${tender.title}
- Description: ${tender.description ?? "Brak opisu"}
- CPV codes: ${tender.cpv_codes?.join(", ") ?? "Brak"}
- Region: ${tender.voivodeship ?? "Brak"}
- Budget min: ${tender.budget_min ?? "Brak"} PLN
- Budget max: ${tender.budget_max ?? "Brak"} PLN

User profile:
- Preferred regions: ${userProfile.preferred_regions?.join(", ") || "Brak preferencji"}
- Preferred CPV codes: ${userProfile.preferred_cpv_codes?.join(", ") || "Brak preferencji"}
- Budget range: ${userProfile.budget_min ?? "Brak"} - ${userProfile.budget_max ?? "Brak"} PLN`,
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[AI] scoreTender: no JSON in response", text);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]) as { score: unknown; reason: unknown };
    const score = Math.min(100, Math.max(0, Number(parsed.score)));
    const reason = String(parsed.reason ?? "");

    return { score, reason };
  } catch (error) {
    console.error("[AI] scoreTender failed:", error);
    return null;
  }
}

export async function summarizeTender(tender: Tender): Promise<string | null> {
  try {
    const anthropic = getAnthropicClient();
    const { text } = await generateText({
      model: anthropic("claude-haiku-4-5"),
      prompt: `Summarize this Polish public tender in 2-3 sentences in Polish. Focus on: what is being procured, how many participants, key requirements, budget. Be concise and specific.

Title: ${tender.title}
Description: ${tender.description ?? "Brak opisu"}`,
    });

    return text.trim();
  } catch (error) {
    console.error("[AI] summarizeTender failed:", error);
    return null;
  }
}

export async function generateBidAdvice(tender: Tender): Promise<string | null> {
  try {
    const anthropic = getAnthropicClient();
    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt: `You are an AI Bid Coach for Polish training tenders. Analyze this tender and provide 3-5 specific, actionable tips in Polish for preparing a winning bid. Consider: pricing strategy, required qualifications, evaluation criteria, common mistakes to avoid. Format as a numbered list.

Title: ${tender.title}
Description: ${tender.description ?? "Brak opisu"}
CPV codes: ${tender.cpv_codes?.join(", ") ?? "Brak"}
Budget min: ${tender.budget_min ?? "Brak"} PLN
Budget max: ${tender.budget_max ?? "Brak"} PLN`,
    });

    return text.trim();
  } catch (error) {
    console.error("[AI] generateBidAdvice failed:", error);
    return null;
  }
}
