"use client"

import * as React from "react"
import { Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ─── types ───────────────────────────────────────────────────────────────────

interface CalcInputs {
  uczestnicy: number
  dni: number
  godzinyDziennie: number
  stawkaTrenera: number
  materialyNaOsobe: number
  salaDzien: number
  salaZapewniona: boolean
  dojazd: number
  cateringOsobaDzien: number
  certyfikatyNaOsobe: number
  narzutAdmin: number
  marza: number
  vatEnabled: boolean
}

interface CalcResult {
  kosztTrenera: number
  kosztMaterialow: number
  kosztSali: number
  kosztDojazdu: number
  kosztCateringu: number
  kosztCertyfikatow: number
  sumaKosztowBezposrednich: number
  narzutAdminKwota: number
  kosztCalkowityNetto: number
  marzaKwota: number
  cenaOfertowaNetto: number
  vatKwota: number
  cenaOfertowaBrutto: number
  cenaOsobodzien: number
  cenaGodzina: number
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const PLN = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function fmt(value: number): string {
  return PLN.format(value) + " PLN"
}

function calculate(inputs: CalcInputs): CalcResult {
  const {
    uczestnicy,
    dni,
    godzinyDziennie,
    stawkaTrenera,
    materialyNaOsobe,
    salaDzien,
    salaZapewniona,
    dojazd,
    cateringOsobaDzien,
    certyfikatyNaOsobe,
    narzutAdmin,
    marza,
    vatEnabled,
  } = inputs

  const kosztTrenera = stawkaTrenera * dni
  const kosztMaterialow = materialyNaOsobe * uczestnicy
  const kosztSali = salaZapewniona ? 0 : salaDzien * dni
  const kosztDojazdu = dojazd
  const kosztCateringu = cateringOsobaDzien * uczestnicy * dni
  const kosztCertyfikatow = certyfikatyNaOsobe * uczestnicy

  const sumaKosztowBezposrednich =
    kosztTrenera +
    kosztMaterialow +
    kosztSali +
    kosztDojazdu +
    kosztCateringu +
    kosztCertyfikatow

  const narzutAdminKwota = sumaKosztowBezposrednich * (narzutAdmin / 100)
  const kosztCalkowityNetto = sumaKosztowBezposrednich + narzutAdminKwota

  const marzaKwota = kosztCalkowityNetto * (marza / 100)
  const cenaOfertowaNetto = kosztCalkowityNetto + marzaKwota

  const vatKwota = vatEnabled ? cenaOfertowaNetto * 0.23 : 0
  const cenaOfertowaBrutto = cenaOfertowaNetto + vatKwota

  const osobodni = uczestnicy * dni
  const godzinyLacznie = osobodni * godzinyDziennie

  const cenaOsobodzien = osobodni > 0 ? cenaOfertowaBrutto / osobodni : 0
  const cenaGodzina = godzinyLacznie > 0 ? cenaOfertowaBrutto / godzinyLacznie : 0

  return {
    kosztTrenera,
    kosztMaterialow,
    kosztSali,
    kosztDojazdu,
    kosztCateringu,
    kosztCertyfikatow,
    sumaKosztowBezposrednich,
    narzutAdminKwota,
    kosztCalkowityNetto,
    marzaKwota,
    cenaOfertowaNetto,
    vatKwota,
    cenaOfertowaBrutto,
    cenaOsobodzien,
    cenaGodzina,
  }
}

// ─── sub-components ──────────────────────────────────────────────────────────

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="border-t border-zinc-800/60 pt-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

interface FieldProps {
  label: string
  suffix?: string
  value: number
  onChange: (v: number) => void
  min?: number
}

function Field({ label, suffix, value, onChange, min = 0 }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm text-zinc-300">{label}</Label>
      <div className="relative flex items-center">
        <Input
          type="number"
          min={min}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="font-mono pr-14 bg-zinc-900/60 border-zinc-700/60 text-zinc-100 focus-visible:ring-sky-500/40"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 text-xs font-medium text-zinc-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

interface ResultRowProps {
  label: string
  value: number
  indent?: boolean
  highlight?: boolean
  separator?: boolean
}

function ResultRow({ label, value, indent, highlight, separator }: ResultRowProps) {
  return (
    <>
      {separator && <div className="my-2 border-t border-zinc-800/70" />}
      <div
        className={`flex items-baseline justify-between gap-2 ${
          indent ? "pl-3" : ""
        }`}
      >
        <span
          className={`text-xs ${
            highlight ? "font-semibold text-zinc-200" : "text-zinc-500"
          }`}
        >
          {label}
        </span>
        <span
          className={`font-mono text-xs tabular-nums ${
            highlight ? "font-semibold text-zinc-100" : "text-zinc-400"
          }`}
        >
          {fmt(value)}
        </span>
      </div>
    </>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────

const DEFAULTS: CalcInputs = {
  uczestnicy: 20,
  dni: 3,
  godzinyDziennie: 8,
  stawkaTrenera: 2500,
  materialyNaOsobe: 50,
  salaDzien: 800,
  salaZapewniona: false,
  dojazd: 0,
  cateringOsobaDzien: 45,
  certyfikatyNaOsobe: 15,
  narzutAdmin: 10,
  marza: 15,
  vatEnabled: false,
}

export default function KalkulatorPage() {
  const [inputs, setInputs] = React.useState<CalcInputs>(DEFAULTS)

  function set<K extends keyof CalcInputs>(key: K, value: CalcInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  const result = calculate(inputs)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
          <Calculator className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Kalkulator oferty szkoleniowej
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Oblicz cenę ofertową dla przetargu szkoleniowego w czasie rzeczywistym
          </p>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ── LEFT: form ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Parametry szkolenia */}
          <Section title="Parametry szkolenia">
            <Field
              label="Liczba uczestników"
              value={inputs.uczestnicy}
              onChange={(v) => set("uczestnicy", v)}
              min={1}
            />
            <Field
              label="Liczba dni szkoleniowych"
              value={inputs.dni}
              onChange={(v) => set("dni", v)}
              min={1}
            />
            <Field
              label="Liczba godzin dziennie"
              suffix="h"
              value={inputs.godzinyDziennie}
              onChange={(v) => set("godzinyDziennie", v)}
              min={1}
            />
          </Section>

          {/* Koszty */}
          <Section title="Koszty">
            <Field
              label="Stawka trenera za dzień"
              suffix="PLN"
              value={inputs.stawkaTrenera}
              onChange={(v) => set("stawkaTrenera", v)}
            />
            <Field
              label="Koszty materiałów na osobę"
              suffix="PLN"
              value={inputs.materialyNaOsobe}
              onChange={(v) => set("materialyNaOsobe", v)}
            />

            {/* Sala + checkbox */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-zinc-300">
                    Koszt sali szkoleniowej za dzień
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      type="number"
                      min={0}
                      value={inputs.salaDzien}
                      disabled={inputs.salaZapewniona}
                      onChange={(e) => set("salaDzien", Number(e.target.value))}
                      className="font-mono pr-14 bg-zinc-900/60 border-zinc-700/60 text-zinc-100 focus-visible:ring-sky-500/40 disabled:opacity-40"
                    />
                    <span className="pointer-events-none absolute right-3 text-xs font-medium text-zinc-500">
                      PLN
                    </span>
                  </div>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-400 select-none">
                    <Checkbox
                      checked={inputs.salaZapewniona}
                      onCheckedChange={(checked) =>
                        set("salaZapewniona", Boolean(checked))
                      }
                      className="border-zinc-600 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                    />
                    Sala zapewniona przez zamawiającego
                  </label>
                </div>
              </div>
            </div>

            <Field
              label="Koszty dojazdu i noclegu"
              suffix="PLN"
              value={inputs.dojazd}
              onChange={(v) => set("dojazd", v)}
            />
            <Field
              label="Catering na osobę / dzień"
              suffix="PLN"
              value={inputs.cateringOsobaDzien}
              onChange={(v) => set("cateringOsobaDzien", v)}
            />
            <Field
              label="Certyfikaty / zaświadczenia na osobę"
              suffix="PLN"
              value={inputs.certyfikatyNaOsobe}
              onChange={(v) => set("certyfikatyNaOsobe", v)}
            />
          </Section>

          {/* Marża i narzuty */}
          <Section title="Marża i narzuty">
            <Field
              label="Narzut administracyjny"
              suffix="%"
              value={inputs.narzutAdmin}
              onChange={(v) => set("narzutAdmin", v)}
            />
            <Field
              label="Marża"
              suffix="%"
              value={inputs.marza}
              onChange={(v) => set("marza", v)}
            />

            {/* VAT radio */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label className="text-sm text-zinc-300">Stawka VAT</Label>
              <div className="flex gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400 select-none">
                  <input
                    type="radio"
                    name="vat"
                    checked={!inputs.vatEnabled}
                    onChange={() => set("vatEnabled", false)}
                    className="accent-sky-500"
                  />
                  Zwolniony z VAT
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400 select-none">
                  <input
                    type="radio"
                    name="vat"
                    checked={inputs.vatEnabled}
                    onChange={() => set("vatEnabled", true)}
                    className="accent-sky-500"
                  />
                  23% VAT
                </label>
              </div>
            </div>
          </Section>

          {/* Save button */}
          <div className="border-t border-zinc-800/60 pt-5">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  disabled
                  className="cursor-not-allowed opacity-50"
                  variant="default"
                >
                  Zapisz kalkulację
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Dostępne w planie Basic+</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* ── RIGHT: summary ── */}
        <div className="w-full lg:w-80 lg:shrink-0 lg:sticky lg:top-20">
          <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/50 p-5 space-y-5">
            {/* Big price */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
                Cena ofertowa brutto
              </p>
              <p className="font-mono text-4xl font-bold tabular-nums text-sky-400 leading-none">
                {PLN.format(result.cenaOfertowaBrutto)}
              </p>
              <p className="mt-0.5 font-mono text-xs text-zinc-500">PLN</p>
            </div>

            {/* Secondary metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/60 px-3 py-2.5">
                <p className="text-[10px] text-zinc-500 mb-0.5">Cena netto</p>
                <p className="font-mono text-sm font-semibold tabular-nums text-zinc-200">
                  {PLN.format(result.cenaOfertowaNetto)}
                </p>
                <p className="font-mono text-[10px] text-zinc-500">PLN</p>
              </div>
              <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/60 px-3 py-2.5">
                <p className="text-[10px] text-zinc-500 mb-0.5">Za osobodzień</p>
                <p className="font-mono text-sm font-semibold tabular-nums text-zinc-200">
                  {PLN.format(result.cenaOsobodzien)}
                </p>
                <p className="font-mono text-[10px] text-zinc-500">PLN</p>
              </div>
              <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/60 px-3 py-2.5 col-span-2">
                <p className="text-[10px] text-zinc-500 mb-0.5">Cena za godzinę szkolenia</p>
                <p className="font-mono text-sm font-semibold tabular-nums text-zinc-200">
                  {PLN.format(result.cenaGodzina)}
                </p>
                <p className="font-mono text-[10px] text-zinc-500">PLN / uczestnik / godz.</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="border-t border-zinc-800/60 pt-4 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">
                Rozbicie kosztów
              </p>

              <ResultRow label="Trener" value={result.kosztTrenera} indent />
              <ResultRow label="Materiały" value={result.kosztMaterialow} indent />
              <ResultRow label="Sala" value={result.kosztSali} indent />
              <ResultRow label="Dojazd i nocleg" value={result.kosztDojazdu} indent />
              <ResultRow label="Catering" value={result.kosztCateringu} indent />
              <ResultRow label="Certyfikaty" value={result.kosztCertyfikatow} indent />

              <ResultRow
                label="Suma kosztów bezpośrednich"
                value={result.sumaKosztowBezposrednich}
                highlight
                separator
              />
              <ResultRow
                label={`+ Narzut administracyjny (${inputs.narzutAdmin}%)`}
                value={result.narzutAdminKwota}
                indent
              />
              <ResultRow
                label="= Koszt całkowity netto"
                value={result.kosztCalkowityNetto}
                highlight
                separator
              />
              <ResultRow
                label={`+ Marża (${inputs.marza}%)`}
                value={result.marzaKwota}
                indent
              />
              <ResultRow
                label="= Cena ofertowa netto"
                value={result.cenaOfertowaNetto}
                highlight
                separator
              />
              <ResultRow
                label={`+ VAT (${inputs.vatEnabled ? "23%" : "zw."})`}
                value={result.vatKwota}
                indent
              />
              <ResultRow
                label="= Cena ofertowa brutto"
                value={result.cenaOfertowaBrutto}
                highlight
                separator
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
