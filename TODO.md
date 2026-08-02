# TODO

Roadmap for Opusline. Ordered roughly by dependency + priority. Each item has enough
context for Claude Code to plan from — but always plan first, confirm, then build
(see CLAUDE.md).

French fiscal terms are kept in French on purpose (CRA, URSSAF, TVA, micro-BNC…) —
they are domain vocabulary, not translatable. All amounts in EUR.

## Core loop

- [ ] **Auth (Laravel + web)**
  Sanctum SPA mode (session + CSRF, `SANCTUM_STATEFUL_DOMAINS`), login/logout,
  `GET /api/me`, protected layout route in TanStack Router. Single-user first
  (the freelance IS the tenant), but keep user_id on everything — self-hosters
  may share an instance later.

- [ ] **Clients & Missions**
  Client CRUD. Mission belongs to a client, carries: rate (TJM day-rate or hourly),
  rate amount, currency (EUR default), status (active/paused/done), optional dates,
  optional ESN/intermediary (e.g. billing goes through an ESN, work is for the
  end-client — model both). This distinction matters for CRA and invoicing later.

- [ ] **Time entries (manual first)**
  Entry: date, duration (or half-day/full-day granularity for TJM missions — TJM
  freelances think in days, not hours), mission, optional note. CRUD + day view.
  Support both granularities from the schema level: `duration_minutes` nullable +
  `day_fraction` nullable (0.5/1.0), exactly one set per entry.

- [ ] **Week view**
  THE core screen. Week grid (days × missions), typed search params (`?week=2026-W31`),
  keyboard-friendly, fast. Totals per day, per mission, per week. Design budget goes here.

- [ ] **Live timer**
  Start/stop, materializes into time entries on stop. One running timer max.
  Server-authoritative (timer state in DB, not localStorage — survives browser close).

- [ ] **CRA export**
  Monthly CRA per mission: grid of days worked (1 / 0.5 / 0), total days, ready to
  send to the ESN/client. PDF export (clean, printable) + maybe XLSX. Pre-filled from
  time entries, manually adjustable before export. This is the differentiator — no
  mainstream tracker does French CRA.

## Money — revenue tracking

- [ ] **Invoices (light tracking, NOT invoice generation)**
  Track invoices sent from elsewhere (Shine): number, client/mission, date, amount HT,
  TVA rate (20% default), amount TTC computed, status (draft/sent/paid + paid date).
  Manual entry first; CSV import from Shine later; don't build PDF invoice generation
  yet (legal minefield — mentions obligatoires, numbering rules — keep for much later).

- [ ] **Monthly revenue dashboard (brut / TVA / net)**
  Per month: total invoiced HT (= CA to declare), TVA collected (not your money —
  display it visually as "owed", e.g. separate muted card), and estimated net after
  URSSAF contributions. Net estimate = HT − cotisations (rate configurable, see
  fiscal settings below). Compare invoiced vs tracked time (spot unbilled days).

- [ ] **"How much can I transfer to my personal account?" calculator**
  The killing feature for peace of mind. From paid invoices (TTC received on the pro
  account): subtract TVA to set aside, subtract URSSAF provision (configurable %),
  subtract optional buffer (fixed amount or %), = safe-to-transfer amount.
  Show the provision breakdown explicitly ("of the €X on your account, €Y is TVA,
  €Z is URSSAF, €W is yours"). Track transfers made to compute remaining.

## Money — declarations & deadlines

- [ ] **URSSAF declaration helper**
  For a given declaration period (monthly or quarterly — configurable), compute the
  CA encaissé (cash basis! paid invoices by paid date, NOT invoice date) to enter on
  autoentrepreneur.urssaf.fr, split by revenue nature if ever needed (BNC here).
  Show the expected cotisation amount from the configured rate so the URSSAF number
  can be sanity-checked. Handle versement libératoire option (extra %) as a setting.

- [ ] **TVA declaration helper**
  For the period (régime réel normal CA3 monthly, or simplifié — configurable):
  TVA collectée from invoices (by encaissement for services), minus TVA déductible
  (needs a light expense tracking: date, label, amount HT, TVA — keep it minimal),
  = TVA to pay. Map the output to the actual CA3 line numbers so it's copy-paste.

- [ ] **Fiscal settings**
  One settings screen: micro-BNC regime, URSSAF periodicity, cotisation rate,
  versement libératoire y/n + rate, TVA regime + periodicity, provision buffer.
  Rates are user-editable numbers (they change every year — 2026 raised the BNC
  rate again; never hardcode, seed with current defaults + a "verify on urssaf.fr"
  hint).

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

## Explicitly out of scope (do not build)

- Full invoice generation (PDF with mentions obligatoires) — v2+ at best.
- Teams / multi-user collaboration — Opusline is solo-first, that's the identity.
- Expense tracking beyond the minimal TVA déductible needs.
- Any accounting beyond micro-BNC cash-basis simplicity (no bilan, no compta d'engagement).