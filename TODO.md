# TODO

Roadmap for Opusline. Ordered roughly by dependency + priority. Each item has enough
context for Claude Code to plan from — but always plan first, confirm, then build
(see CLAUDE.md).

French fiscal terms are kept in French on purpose (CRA, URSSAF, TVA, micro-BNC…) —
they are domain vocabulary, not translatable. All amounts in EUR.

Design reference : https://claude.ai/design/p/cf894101-b71a-4607-bb25-eed1925c831d?file=Opusline.dc.html

## Cross-cutting decisions (apply everywhere, not re-litigable)

- **Money**: `https://github.com/cknow/laravel-money` value objects everywhere money is touched. Storage is
  **integer cents** (`*_cents` bigint columns, implied EUR) — never float, never
  DECIMAL cast to float. Every rounding is explicit (`RoundingMode::HALF_UP` unless
  a fiscal rule says otherwise). API serializes money as
  `{ amount: <int minor units>, currency: "EUR" }`; the frontend formats with
  `Intl.NumberFormat('fr-FR')` and NEVER does money arithmetic — totals always come
  from the API. One custom spatie/laravel-data Cast/Transformer for Money, written
  once (invoices step), reused everywhere.
- **Rates & percentages** (TVA, URSSAF, versement libératoire…): stored as exact
  decimals (basis points integer, or decimal string fed to brick/math (don't use bric/math, the package is too new, find something else)) — 
  never float.
  User-editable settings, seeded with current defaults, never hardcoded in logic.
- **Billing mode lives on the mission** (`daily` = TJM | `hourly`). It drives which
  time-entry column is legal, validation rules, and week-view cell UI. Entries never
  choose their own mode. Mode is immutable once the mission has entries (new contract
  = new mission).
- **Time entry schema**: `duration_minutes` (int, nullable) XOR `day_fraction`
  (nullable, values 0.25/0.5/1.0) — exactly one set, enforced by a DB check
  constraint, matching the mission's mode.

## Core loop (v1 — ships when this section is done)

- [ ] **Clients & Missions**
  Client CRUD. Mission belongs to a client, carries: billing mode (daily TJM |
  hourly), rate (`rate_cents`), currency (EUR default), status (active/paused/done),
  optional dates, optional ESN/intermediary (billing goes through an ESN, work is
  for the end-client — model both). This distinction matters for CRA and invoicing
  later.

- [ ] **Time entries (manual first)**
  Entry: date, mission, quantity in the mission's unit (day_fraction for TJM —
  TJM freelances think in days, not hours — duration_minutes for hourly), optional
  note. Schema per cross-cutting decisions above. CRUD + day view rendering each
  entry in its natural unit ("0,5 j" vs "3h30").

- [ ] **Week view**
  THE core screen. Week grid (days × missions), typed search params (`?week=2026-W31`),
  keyboard-friendly, fast. TJM mission rows: one-keystroke day/half-day toggles per
  cell (the dominant interaction — "mark Tuesday as worked"). Hourly rows: duration
  input. Totals per day, per mission, per week, each in its own unit. Design budget
  goes here.

- [ ] **Live timer**
  Start/stop, materializes into time entries on stop. **Hourly missions only** —
  a stopwatch against a TJM day is meaningless; TJM keeps the one-tap day marking.
  One running timer max. Server-authoritative (timer state in DB, not localStorage —
  survives browser close).

- [ ] **CRA export**
  Monthly CRA per mission: grid of days worked (1 / 0.5 / 0), total days, addressed
  to the ESN or end-client per the mission's setup, ready to send. PDF export (clean,
  printable) + maybe XLSX. Pre-filled from time entries, manually adjustable before
  export. This is the differentiator — no mainstream tracker does French CRA.
  For TJM missions this is pure day-fraction summing; no hour→day conversion guesswork.

## Money — revenue tracking (v1.1)

- [ ] **Invoices (light tracking, NOT invoice generation)**
  Track invoices sent from elsewhere (Shine): number, client/mission, date,
  `amount_ht_cents`, TVA rate (20% default, from settings), `amount_ttc_cents`
  computed via https://github.com/cknow/laravel-money **but overridable** — rounding conventions differ between
  tools (per-line vs per-total) and the tracked invoice must match the real document
  to the cent; the real encaissé is the fiscal truth, not our arithmetic. Status
  (draft/sent/paid). `paid_date` is **required when status=paid and fiscally
  load-bearing** (cash-basis declarations key on it): warn loudly on edit — moving
  it shifts revenue across declaration periods. Manual entry first; CSV import from
  Shine later; don't build PDF invoice generation (legal minefield — mentions
  obligatoires, numbering rules — much later, if ever).

- [ ] **Monthly revenue dashboard (brut / TVA / net)**
  Per month: total invoiced HT (= CA to declare), TVA collected (not your money —
  display it visually as "owed", e.g. separate muted card), and estimated net after
  URSSAF contributions. Net estimate = HT − cotisations (rate from fiscal settings).
  Compare invoiced vs tracked time (spot unbilled days). All aggregation server-side.

- [ ] **"How much can I transfer to my personal account?" calculator**
  The killer feature for peace of mind. From paid invoices (TTC received on the pro
  account): subtract TVA to set aside, subtract URSSAF provision (configurable %),
  subtract optional buffer (fixed amount or %), = safe-to-transfer amount.
  Show the provision breakdown explicitly ("of the €X on your account, €Y is TVA,
  €Z is URSSAF, €W is yours"). Track transfers made to compute remaining. Every
  intermediate amount is a Money object with explicit rounding — this screen is
  where float math would quietly lie.

## Money — declarations & deadlines (v1.2)

- [ ] **URSSAF declaration helper**
  For a given declaration period (monthly or quarterly — configurable), compute the
  CA encaissé (**cash basis!** paid invoices by `paid_date`, NOT invoice date) to
  enter on autoentrepreneur.urssaf.fr, split by revenue nature if ever needed (BNC
  here). Show the expected cotisation amount from the configured rate so the URSSAF
  number can be sanity-checked. Handle versement libératoire option (extra %) as a
  setting.

- [ ] **TVA declaration helper**
  For the period (régime réel normal CA3 monthly, or simplifié — configurable):
  TVA collectée from invoices (by encaissement for services), minus TVA déductible
  (needs a light expense tracking: date, label, amount_ht_cents, TVA — keep it
  minimal), = TVA to pay. Map the output to the actual CA3 line numbers so it's
  copy-paste.

- [ ] **Fiscal settings**
  One settings screen: micro-BNC regime, URSSAF periodicity, cotisation rate,
  versement libératoire y/n + rate, TVA regime + periodicity, provision buffer.
  Rates are user-editable exact decimals (they change every year — 2026 raised the
  BNC rate again; never hardcode, seed with current defaults + a "verify on
  urssaf.fr" hint).

- [ ] **Deadline reminders**
  Recurring deadlines: URSSAF declaration + payment, TVA CA3, CFE (December — the
  one everyone forgets), impôt acomptes if not in versement libératoire. In-app
  notification center + optional email (Resend). Nice: expose an **ICS feed** so
  deadlines land in any calendar app — cheap to build, huge value.

- [ ] **Plafond micro-BNC watcher**
  Track CA against the micro-BNC ceiling (configurable, ~77.7k€) and the TVA
  thresholds. Progress bar on the dashboard + warning when trajectory (extrapolated
  from current run rate) crosses the ceiling before year-end. Losing micro status
  by surprise is the classic freelance horror story.

## Cool ideas (later, unordered)

- [ ] **Notes per client/mission** — meeting notes, credentials-adjacent info
  (non-secret), decisions. Markdown, attached to client or mission. (Deferred from v1.)
- [ ] **Accountant export** — one ZIP per period: invoices list CSV, CA summary,
  TVA summary. Even micro-entrepreneurs get audited.
- [ ] **Year dashboard** — CA per month bar chart (amber, obviously), per-client
  breakdown, days worked per month, average effective TJM (CA / days worked —
  brutal honesty metric).
- [ ] **Forecast** — from active missions × planned days: projected CA for the
  quarter/year, projected vs ceiling.
- [ ] **Shine CSV/bank import** — reconcile paid invoices automatically from bank
  statement export instead of manual "mark as paid".
- [ ] **Mission budget alerts** — for fixed-budget missions: consumed vs budget.
- [ ] **Public API + docs** — the OpenAPI spec is already there; publish it once
  stable. Kimai's adoption owes a lot to its API.
- [ ] **i18n FR/EN** — strings are kept extractable from day one; actually wire
  i18n when the core is stable. FR-first market, EN for OSS reach.
- [ ] **Wizard** before starting

## Explicitly out of scope (do not build)

- Full invoice generation (PDF with mentions obligatoires) — v2+ at best.
- Teams / multi-user collaboration — Opusline is solo-first, that's the identity.
- Expense tracking beyond the minimal TVA déductible needs.
- Any accounting beyond micro-BNC cash-basis simplicity (no bilan, no compta
  d'engagement).
- Money arithmetic in the frontend, float money anywhere, hardcoded fiscal rates.