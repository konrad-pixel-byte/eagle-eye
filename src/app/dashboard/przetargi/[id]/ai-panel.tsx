"use client";

import * as React from "react";
import {
  BrainIcon,
  StarIcon,
  BookOpenIcon,
  LoaderIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeGate } from "@/components/upgrade-gate";
import type { SubscriptionTier } from "@/lib/subscription";

interface AiPanelProps {
  tenderId: string;
  userTier: SubscriptionTier;
  initialSummary?: string | null;
  initialScore?: number | null;
}

interface ScoreResult {
  score: number;
  reason: string;
}

type LoadingKey = "summary" | "score" | "bid-coach" | null;

async function callAiApi(
  tenderId: string,
  type: "summary" | "score" | "bid-coach"
): Promise<{ result: unknown } | { error: string }> {
  const res = await fetch("/api/ai/analyze-tender", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenderId, type }),
  });
  return res.json() as Promise<{ result: unknown } | { error: string }>;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-emerald-500"
      : score >= 40
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

function AiPanelInner({
  tenderId,
  initialSummary,
  initialScore,
}: {
  tenderId: string;
  initialSummary?: string | null;
  initialScore?: number | null;
}) {
  const [loading, setLoading] = React.useState<LoadingKey>(null);
  const [summary, setSummary] = React.useState<string | null>(initialSummary ?? null);
  const [score, setScore] = React.useState<ScoreResult | null>(
    initialScore != null ? { score: initialScore, reason: "" } : null
  );
  const [bidAdvice, setBidAdvice] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleAction(type: "summary" | "score" | "bid-coach") {
    setLoading(type);
    setError(null);

    const data = await callAiApi(tenderId, type);

    if ("error" in data) {
      setError(data.error);
    } else if (type === "summary") {
      setSummary(data.result as string);
    } else if (type === "score") {
      setScore(data.result as ScoreResult);
    } else if (type === "bid-coach") {
      setBidAdvice(data.result as string);
    }

    setLoading(null);
  }

  const bidLines = bidAdvice
    ? bidAdvice.split(/\n/).filter((l) => l.trim().length > 0)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainIcon className="size-5 text-sky-400" />
          Analiza AI
        </CardTitle>
        <CardDescription>
          Podsumowanie, ocena dopasowania i porady dla oferentów
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {error && (
          <p className="text-xs text-red-400 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2">
            {error}
          </p>
        )}

        {/* Summary section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
              <BookOpenIcon className="size-4 text-zinc-500" />
              Podsumowanie
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("summary")}
              disabled={loading !== null}
              className="h-7 text-xs gap-1.5"
            >
              {loading === "summary" ? (
                <LoaderIcon className="size-3 animate-spin" />
              ) : null}
              {summary ? "Odśwież" : "Generuj podsumowanie"}
            </Button>
          </div>
          {summary ? (
            <p className="text-sm text-zinc-300 leading-relaxed animate-in fade-in duration-500">
              {summary}
            </p>
          ) : (
            <p className="text-xs text-zinc-500 italic">
              Kliknij przycisk, aby wygenerować podsumowanie przetargu.
            </p>
          )}
        </div>

        <div className="border-t border-zinc-800" />

        {/* Score section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
              <StarIcon className="size-4 text-zinc-500" />
              Dopasowanie do profilu
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("score")}
              disabled={loading !== null}
              className="h-7 text-xs gap-1.5"
            >
              {loading === "score" ? (
                <LoaderIcon className="size-3 animate-spin" />
              ) : null}
              {score ? "Przelicz" : "Oblicz dopasowanie"}
            </Button>
          </div>
          {score ? (
            <div className="flex flex-col gap-2 animate-in fade-in duration-500">
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-bold text-zinc-100 tabular-nums">
                  {score.score}
                </span>
                <span className="text-sm text-zinc-500">/ 100</span>
              </div>
              <ScoreBar score={score.score} />
              {score.reason && (
                <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                  {score.reason}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 italic">
              Oblicz, jak dobrze ten przetarg pasuje do Twojego profilu.
            </p>
          )}
        </div>

        <div className="border-t border-zinc-800" />

        {/* Bid Coach section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
              <BrainIcon className="size-4 text-zinc-500" />
              AI Bid Coach
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("bid-coach")}
              disabled={loading !== null}
              className="h-7 text-xs gap-1.5"
            >
              {loading === "bid-coach" ? (
                <LoaderIcon className="size-3 animate-spin" />
              ) : null}
              {bidAdvice ? "Odśwież porady" : "Generuj porady"}
            </Button>
          </div>
          {bidAdvice ? (
            <ol className="flex flex-col gap-2 animate-in fade-in duration-500">
              {bidLines.map((line, i) => {
                const clean = line.replace(/^\d+[\.\)]\s*/, "");
                return (
                  <li key={i} className="flex gap-2.5 text-sm text-zinc-300 leading-relaxed">
                    <span className="font-mono text-xs text-sky-400 shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <span>{clean}</span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="text-xs text-zinc-500 italic">
              Uzyskaj spersonalizowane porady, jak wygrać ten przetarg.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AiPanel({
  tenderId,
  userTier,
  initialSummary,
  initialScore,
}: AiPanelProps) {
  return (
    <UpgradeGate feature="ai-bid-coach" userTier={userTier}>
      <AiPanelInner
        tenderId={tenderId}
        initialSummary={initialSummary}
        initialScore={initialScore}
      />
    </UpgradeGate>
  );
}
