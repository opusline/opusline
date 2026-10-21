import { randomUUID } from "node:crypto";
import type {
  ClientData,
  CreateClientData,
  CreateInvoiceData,
  CreateMissionData,
  InvoiceData,
  InvoiceDetailData,
  InvoicingSettingsData,
  MissionData,
  QuoteDetailData,
  RegisterUserData,
  SaveInvoiceDraftData,
  SaveQuoteDraftData,
  SettingsData,
  TimeEntryInputData,
  UpdateInvoicingSettingsData,
  UpdateSettingsData,
} from "@opusline/api-client";
import type { Api } from "./api";

export type Account = {
  name: string;
  email: string;
  password: string;
};

export function newAccount(): Account {
  return {
    name: "Camille Aubrac",
    email: `e2e-${randomUUID()}@example.com`,
    password: "correct-horse-battery",
  };
}

/** Registering signs the account in, so the context browses as it afterwards. */
export async function registerAccount(api: Api): Promise<Account> {
  const account = newAccount();
  const registration: RegisterUserData = {
    name: account.name,
    email: account.email,
    password: account.password,
    password_confirmation: account.password,
  };

  await api.post("/api/register", registration);

  return account;
}

/** What a new account counts as one day; a day-billed entry is a share of it. */
export const WORKDAY_MINUTES = 420;

const CLIENT_TYPE_DIRECT = 0;
const BILLING_MODE_DAILY = 0;

export async function createClient(
  api: Api,
  client: Partial<CreateClientData> & Pick<CreateClientData, "name">,
): Promise<ClientData> {
  const payload: CreateClientData = { type: CLIENT_TYPE_DIRECT, ...client };

  return api.post<ClientData>("/api/clients", payload);
}

/** A day-billed mission at 550 € unless the test says otherwise. */
export async function createMission(
  api: Api,
  client: ClientData,
  mission: Partial<CreateMissionData> & Pick<CreateMissionData, "name">,
): Promise<MissionData> {
  const payload: CreateMissionData = {
    billingMode: BILLING_MODE_DAILY,
    rate: { amount: 55_000, currency: "EUR" },
    ...mission,
  };

  return api.post<MissionData>(`/api/clients/${client.slug}/missions`, payload);
}

export async function logTime(
  api: Api,
  entry: TimeEntryInputData,
): Promise<void> {
  await api.post("/api/time-entries", entry);
}

export const INVOICE_STATUS_SENT = 1;
export const INVOICE_STATUS_PAID = 2;

export async function addInvoice(
  api: Api,
  invoice: CreateInvoiceData,
): Promise<InvoiceData> {
  return api.post<InvoiceData>("/api/invoices", invoice);
}

/**
 * Writing invoices in Opusline is in beta: the stack offers it, and an account
 * sees it once it opts in, as it would from Réglages → Avant-première.
 */
export async function joinInvoicingBeta(api: Api): Promise<void> {
  await api.put("/api/user/features/invoicing", { active: true });
}

/** Several bank accounts side by side are in beta, like invoicing. */
export async function joinBankAccountsBeta(api: Api): Promise<void> {
  await api.put("/api/user/features/bank_accounts", { active: true });
}

/** Réglages → Facturation set to writing invoices in Opusline rather than another tool. */
export async function writeInvoicesInOpusline(api: Api): Promise<void> {
  const current = await api.get<InvoicingSettingsData>(
    "/api/invoicing/settings",
  );
  const settings: UpdateInvoicingSettingsData = {
    mode: 0,
    defaultPaymentTermsDays: current.defaultPaymentTermsDays,
    defaultPaymentTermsEndOfMonth: current.defaultPaymentTermsEndOfMonth,
    quoteValidityDays: current.quoteValidityDays,
    operationCategory: current.operationCategory,
    showIbanOnInvoices: current.showIbanOnInvoices,
    showEmailOnDocuments: current.showEmailOnDocuments,
    vatOnDebits: current.vatOnDebits,
    documentLanguage: current.documentLanguage,
    latePenaltyRateBp: current.latePenaltyRateBp,
    customMentions: current.customMentions,
    quoteNumberFormat: current.quoteNumberFormat,
    creditNoteNumberFormat: current.creditNoteNumberFormat,
  };

  await api.put("/api/invoicing/settings", settings);
}

/** The seller identity an invoice needs before it can be validated. */
export async function fillInvoicingIdentity(api: Api): Promise<void> {
  const current = await api.get<SettingsData>("/api/settings");
  const identity: UpdateSettingsData = {
    ...current,
    tradeName: "Camille Aubrac",
    siret: "12345678200002",
    companyAddressLine1: "12 rue de Strasbourg",
    companyPostalCode: "44000",
    companyCity: "Nantes",
    contactEmail: "camille@aubrac.test",
    iban: "FR7630006000011234567890189",
    bic: "AGRIFRPP",
  };

  await api.put("/api/settings", identity);
}

/** A client the invoices can be issued to: it needs a billing address. */
export async function createBillableClient(
  api: Api,
  client: Partial<CreateClientData> & Pick<CreateClientData, "name">,
): Promise<ClientData> {
  return createClient(api, {
    billingAddressLine1: "3 impasse des Potiers",
    billingPostalCode: "44100",
    billingCity: "Nantes",
    ...client,
  });
}

/** An invoice written in Opusline and validated: numbered, its PDF filed. */
export async function issueInvoice(
  api: Api,
  client: ClientData,
  overrides: Partial<SaveInvoiceDraftData> = {},
): Promise<InvoiceDetailData> {
  const draft: SaveInvoiceDraftData = {
    clientId: client.id,
    issuedOn: "2026-08-01",
    paymentTermsDays: 30,
    paymentTermsEndOfMonth: false,
    showIban: true,
    showEmail: true,
    language: 0,
    lines: [
      {
        label: "Journée de développement frontend",
        quantityMilli: 2_000,
        unit: 0,
        unitPrice: { amount: 60_000, currency: "EUR" },
        vatRateBp: 0,
      },
    ],
    ...overrides,
  };
  const created = await api.post<InvoiceDetailData>(
    "/api/invoicing/invoices",
    draft,
  );

  return api.post<InvoiceDetailData>(
    `/api/invoicing/invoices/${created.invoice.id}/issue`,
    {},
  );
}

/** A quote written in Opusline and validated, waiting for the client's answer. */
export async function issueQuote(
  api: Api,
  client: ClientData,
  overrides: Partial<SaveQuoteDraftData> = {},
): Promise<QuoteDetailData> {
  const draft: SaveQuoteDraftData = {
    clientId: client.id,
    validityDays: 30,
    paymentTermsDays: 30,
    paymentTermsEndOfMonth: false,
    showEmail: true,
    language: 0,
    lines: [
      {
        label: "Audit de performance",
        quantityMilli: 2_000,
        unit: 0,
        unitPrice: { amount: 60_000, currency: "EUR" },
        vatRateBp: 0,
      },
    ],
    ...overrides,
  };
  const created = await api.post<QuoteDetailData>(
    "/api/invoicing/quotes",
    draft,
  );

  return api.post<QuoteDetailData>(
    `/api/invoicing/quotes/${created.quote.id}/issue`,
    {},
  );
}
