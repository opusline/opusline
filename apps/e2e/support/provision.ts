import { randomUUID } from "node:crypto";
import type { RegisterUserData } from "@opusline/api-client";
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
