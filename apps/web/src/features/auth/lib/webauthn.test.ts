import { WebAuthnError } from "@simplewebauthn/browser";
import { describe, expect, it } from "vitest";

import { webAuthnFailure } from "./webauthn";

function libraryError(
  code: ConstructorParameters<typeof WebAuthnError>[0]["code"],
  cause = new Error("x"),
) {
  return new WebAuthnError({ message: "x", code, cause });
}

describe("webAuthnFailure", () => {
  it("reads the library's own codes", () => {
    expect(webAuthnFailure(libraryError("ERROR_CEREMONY_ABORTED"))).toBe(
      "cancelled",
    );
    expect(
      webAuthnFailure(
        libraryError("ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED"),
      ),
    ).toBe("duplicate");
    expect(
      webAuthnFailure(
        libraryError(
          "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
        ),
      ),
    ).toBe("unsupported");
  });

  it("falls back to the DOM exception behind a passthrough code", () => {
    expect(
      webAuthnFailure(
        libraryError(
          "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
          new DOMException("no", "NotAllowedError"),
        ),
      ),
    ).toBe("cancelled");
    expect(
      webAuthnFailure(
        libraryError(
          "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
          new DOMException("dup", "InvalidStateError"),
        ),
      ),
    ).toBe("duplicate");
  });

  it("treats an unknown library code without a DOM cause as a plain failure", () => {
    expect(
      webAuthnFailure(libraryError("ERROR_AUTHENTICATOR_GENERAL_ERROR")),
    ).toBe("failed");
  });

  it("classifies a bare DOM exception", () => {
    expect(webAuthnFailure(new DOMException("no", "NotAllowedError"))).toBe(
      "cancelled",
    );
    expect(webAuthnFailure(new DOMException("no", "NotSupportedError"))).toBe(
      "unsupported",
    );
    expect(webAuthnFailure(new DOMException("no", "UnknownError"))).toBe(
      "failed",
    );
    expect(webAuthnFailure(new DOMException("no", "AbortError"))).toBe(
      "cancelled",
    );
    expect(webAuthnFailure(new DOMException("no", "SecurityError"))).toBe(
      "unsupported",
    );
  });

  it("leaves server and network errors to the usual handling", () => {
    expect(webAuthnFailure({ status: 422, errors: {} })).toBeNull();
    expect(webAuthnFailure(new TypeError("fetch failed"))).toBeNull();
    expect(webAuthnFailure(null)).toBeNull();
  });
});
