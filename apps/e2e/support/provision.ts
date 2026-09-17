import { randomUUID } from "node:crypto";
import type {
  ClientData,
  CreateClientData,
  CreateInvoiceData,
  CreateMissionData,
  InvoiceData,
  MissionData,
  RegisterUserData,
  TimeEntryInputData,
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
