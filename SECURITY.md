# Bezpieczeństwo / Security

## Zgłaszanie luk / Reporting vulnerabilities

Jeśli znalazłeś podatność w Eagle Eye, **nie zgłaszaj jej jako publicznego issue**
na GitHubie. Zamiast tego napisz na:

**security@hatedapps.pl**

Dołącz:

- Opis problemu i potencjalny wpływ
- Kroki potrzebne do reprodukcji
- Jeżeli posiadasz — proof-of-concept

Odpowiadamy w ciągu 72h i staramy się wdrożyć poprawkę w 7 dni dla krytycznych
problemów, 30 dni dla pozostałych.

---

If you've found a security vulnerability in Eagle Eye, please do **not** file a
public GitHub issue. Email **security@hatedapps.pl** instead.

Include:

- A description of the issue and its impact
- Steps to reproduce
- Any proof-of-concept you have

We acknowledge within 72 hours and aim to ship fixes within 7 days for critical
issues, 30 days otherwise.

## Zakres / Scope

**W zakresie / In scope:**

- eagle-eye.hatedapps.pl i jej subdomeny
- API pod `/api/**`
- Kod z tego repozytorium

**Poza zakresem / Out of scope:**

- Supabase self-hosted infrastructure (report to Supabase upstream)
- Third-party services (Stripe, Resend, Anthropic)
- Social engineering, fizyczne ataki
- DoS / DDoS

## Bezpieczne praktyki / Safe harbor

Nie podejmiemy działań prawnych wobec badaczy, którzy:

- Działają w dobrej wierze i przestrzegają tego policy
- Nie niszczą danych i nie naruszają prywatności użytkowników
- Nie wykorzystują znalezionej luki poza minimalnym PoC
- Dają nam rozsądny czas na poprawkę przed publiczną dyskusją
