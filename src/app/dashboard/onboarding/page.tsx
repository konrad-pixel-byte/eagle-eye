"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

import { completeOnboarding } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VOIVODESHIPS = [
  "dolnośląskie",
  "kujawsko-pomorskie",
  "lubelskie",
  "lubuskie",
  "łódzkie",
  "małopolskie",
  "mazowieckie",
  "opolskie",
  "podkarpackie",
  "podlaskie",
  "pomorskie",
  "śląskie",
  "świętokrzyskie",
  "warmińsko-mazurskie",
  "wielkopolskie",
  "zachodniopomorskie",
] as const;

const CPV_SPECIALIZATIONS = [
  { label: "Szkolenia personelu", code: "80511000-9" },
  { label: "Szkolenia zawodowe", code: "80530000-8" },
  { label: "Szkolenia z zarządzania", code: "80532000-2" },
  { label: "Szkolenia BHP", code: "80550000-4" },
  { label: "Kompetencje miękkie", code: "80570000-0" },
  { label: "Pierwsza pomoc", code: "80562000-1" },
  { label: "IT i e-learning", code: "80533100-0" },
  { label: "Szkolenia językowe", code: "80571000-7" },
  { label: "Coaching i doradztwo", code: "79634000-7" },
] as const;

const COMPANY_SIZES = [
  { value: "1", label: "1 osoba (freelancer)" },
  { value: "2-5", label: "2–5 osób" },
  { value: "6-20", label: "6–20 osób" },
  { value: "20+", label: "20+ osób" },
] as const;

const TOTAL_STEPS = 3;

interface FormState {
  company_name: string;
  phone: string;
  company_size: string;
  regions: string[];
  specializations: string[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    company_name: "",
    phone: "",
    company_size: "",
    regions: [],
    specializations: [],
  });

  const progressPercent = (step / TOTAL_STEPS) * 100;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayItem(key: "regions" | "specializations", value: string) {
    setForm((prev) => {
      const current = prev[key];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  }

  function toggleAllRegions() {
    const allSelected = form.regions.length === VOIVODESHIPS.length;
    setForm((prev) => ({
      ...prev,
      regions: allSelected ? [] : [...VOIVODESHIPS],
    }));
  }

  function canAdvance(): boolean {
    if (step === 1) return form.company_name.trim().length > 0;
    if (step === 2) return form.regions.length > 0;
    if (step === 3) return form.specializations.length > 0;
    return false;
  }

  async function handleFinish() {
    if (!canAdvance()) return;
    setError(null);
    setIsSubmitting(true);

    try {
      await completeOnboarding({
        company_name: form.company_name.trim(),
        phone: form.phone.trim(),
        preferred_regions: form.regions,
        preferred_cpv_codes: form.specializations,
      });
      router.push("/dashboard/przetargi");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd."
      );
      setIsSubmitting(false);
    }
  }

  function handleNext() {
    if (canAdvance() && step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  const allRegionsSelected = form.regions.length === VOIVODESHIPS.length;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-zinc-950 px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-2.5">
          <Eye className="size-5 text-zinc-100" />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            Eagle Eye
          </span>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">
              Krok {step} z {TOTAL_STEPS}
            </span>
            <span className="text-xs text-zinc-600">
              {step === 1 && "Twój profil"}
              {step === 2 && "Twoje regiony"}
              {step === 3 && "Twoje specjalizacje"}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-zinc-100 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
          {/* Step 1 — Twój profil */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">
                  Twój profil
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Kilka informacji o Twojej firmie, aby lepiej dopasować wyniki.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="company_name" className="text-zinc-100">
                    Nazwa firmy <span className="text-zinc-500">*</span>
                  </Label>
                  <Input
                    id="company_name"
                    type="text"
                    placeholder="np. Szkolenia XYZ Sp. z o.o."
                    value={form.company_name}
                    onChange={(e) =>
                      updateField("company_name", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone" className="text-zinc-100">
                    Telefon{" "}
                    <span className="text-zinc-500 font-normal">
                      (opcjonalnie)
                    </span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+48 500 000 000"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="company_size" className="text-zinc-100">
                    Wielkość firmy
                  </Label>
                  <Select
                    value={form.company_size}
                    onValueChange={(val) => updateField("company_size", val ?? "")}
                  >
                    <SelectTrigger
                      id="company_size"
                      className="w-full border-zinc-700 bg-zinc-800 text-zinc-100 data-placeholder:text-zinc-500"
                    >
                      <SelectValue placeholder="Wybierz wielkość firmy" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Twoje regiony */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">
                  Twoje regiony
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Wybierz województwa, w których szukasz przetargów. Wymagane
                  co najmniej jedno.
                </p>
              </div>

              <div className="space-y-4">
                {/* Select all toggle */}
                <button
                  type="button"
                  onClick={toggleAllRegions}
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors underline underline-offset-2"
                >
                  {allRegionsSelected
                    ? "Odznacz wszystkie"
                    : "Zaznacz wszystkie"}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {VOIVODESHIPS.map((voivodeship) => {
                    const isChecked = form.regions.includes(voivodeship);
                    return (
                      <label
                        key={voivodeship}
                        className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-zinc-800 transition-colors"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() =>
                            toggleArrayItem("regions", voivodeship)
                          }
                        />
                        <span className="text-sm capitalize text-zinc-300">
                          {voivodeship}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {form.regions.length > 0 && (
                  <p className="text-xs text-zinc-500">
                    Wybrano: {form.regions.length} z {VOIVODESHIPS.length}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3 — Twoje specjalizacje */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">
                  Twoje specjalizacje
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Wybierz kategorie szkoleń, które realizujesz. Wymagana co
                  najmniej jedna.
                </p>
              </div>

              <div className="space-y-2">
                {CPV_SPECIALIZATIONS.map((spec) => {
                  const isChecked = form.specializations.includes(spec.code);
                  return (
                    <label
                      key={spec.code}
                      className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-2 hover:bg-zinc-800 transition-colors"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() =>
                          toggleArrayItem("specializations", spec.code)
                        }
                        className="mt-0.5 shrink-0"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-zinc-100">
                          {spec.label}
                        </span>
                        <span className="text-xs text-zinc-600 font-mono">
                          {spec.code}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {form.specializations.length > 0 && (
                <p className="text-xs text-zinc-500">
                  Wybrano: {form.specializations.length} z{" "}
                  {CPV_SPECIALIZATIONS.length}
                </p>
              )}

              {error && (
                <p className="rounded-md border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-400">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 1 ? (
              <Button
                type="button"
                onClick={handleBack}
                className="border border-zinc-700 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 active:scale-[0.98] transition-all"
              >
                Wstecz
              </Button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canAdvance()}
                className="bg-zinc-100 text-zinc-950 hover:bg-white active:scale-[0.98] transition-all font-medium disabled:opacity-40"
              >
                Dalej
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinish}
                disabled={!canAdvance() || isSubmitting}
                className="bg-zinc-100 text-zinc-950 hover:bg-white active:scale-[0.98] transition-all font-medium disabled:opacity-40"
              >
                {isSubmitting ? "Zapisywanie…" : "Zakończ konfigurację"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
