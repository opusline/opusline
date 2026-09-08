import { describe, expect, it } from "vitest";

import { CURRENT_USER_FIXTURE } from "@/test/current-user";
import { classifyChallengeError, isTwoFactorChallenge } from "./two-factor";

describe("isTwoFactorChallenge", () => {
  it("tells the challenge body from the user body", () => {
    expect(
      isTwoFactorChallenge({ twoFactorRequired: true, methods: [0] }),
    ).toBe(true);
    expect(isTwoFactorChallenge(CURRENT_USER_FIXTURE)).toBe(false);
  });
});

describe("classifyChallengeError", () => {
  it("routes a wrong code to its field", () => {
    expect(
      classifyChallengeError({
        status: 422,
        errors: { code: ["Le code est invalide ou a expiré."] },
      }),
    ).toEqual({
      status: "invalid",
      field: "code",
      message: "Le code est invalide ou a expiré.",
    });
  });

  it("routes a spent recovery code to its field", () => {
    expect(
      classifyChallengeError({
        status: 422,
        errors: { recoveryCode: ["Ce code de secours a déjà été utilisé."] },
      }),
    ).toEqual({
      status: "invalid",
      field: "recoveryCode",
      message: "Ce code de secours a déjà été utilisé.",
    });
  });

  it("treats a 409 as an expired pending login, keeping the server's reason", () => {
    expect(
      classifyChallengeError({
        status: 409,
        message: "Trop de codes erronés.",
      }),
    ).toEqual({ status: "expired", message: "Trop de codes erronés." });
  });

  it("treats a 429 as the limiter", () => {
    expect(classifyChallengeError({ status: 429 })).toMatchObject({
      status: "throttled",
    });
  });

  it("treats anything else as a plain failure", () => {
    expect(classifyChallengeError(new TypeError("fetch failed"))).toEqual({
      status: "failed",
    });
  });
});
