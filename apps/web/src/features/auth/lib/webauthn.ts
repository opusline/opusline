import {
  type AuthenticationResponseJSON,
  browserSupportsWebAuthn,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
  type RegistrationResponseJSON,
  startAuthentication,
  startRegistration,
  WebAuthnError,
} from "@simplewebauthn/browser";

type OptionsJSON = Record<string, unknown>;

export function isWebAuthnSupported(): boolean {
  return browserSupportsWebAuthn();
}

/** Runs the registration ceremony on options the API issued; the result is what the API stores. */
export function createPasskey(
  options: OptionsJSON,
): Promise<RegistrationResponseJSON> {
  return startRegistration({
    optionsJSON: options as unknown as PublicKeyCredentialCreationOptionsJSON,
  });
}

/** Runs the assertion ceremony on options the API issued; the result is what the API verifies. */
export function assertPasskey(
  options: OptionsJSON,
): Promise<AuthenticationResponseJSON> {
  return startAuthentication({
    optionsJSON: options as unknown as PublicKeyCredentialRequestOptionsJSON,
  });
}

export type WebAuthnFailure =
  | "cancelled"
  | "unsupported"
  | "duplicate"
  | "failed";

/**
 * What went wrong in the browser ceremony, or null when the error is not
 * the browser's at all (a refused request, a network failure) and the usual
 * server-error handling applies.
 */
export function webAuthnFailure(error: unknown): WebAuthnFailure | null {
  if (error instanceof WebAuthnError) {
    switch (error.code) {
      case "ERROR_CEREMONY_ABORTED":
        return "cancelled";
      case "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED":
        return "duplicate";
      case "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT":
      case "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT":
      case "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG":
        return "unsupported";
      default:
        return fromDomException(error.cause) ?? "failed";
    }
  }

  return fromDomException(error);
}

function fromDomException(error: unknown): WebAuthnFailure | null {
  // The credentials API rejects with a DOMException; checked by tag rather
  // than instanceof, which jsdom's implementation does not satisfy.
  if (
    typeof error !== "object" ||
    error === null ||
    Object.prototype.toString.call(error) !== "[object DOMException]" ||
    !("name" in error) ||
    typeof error.name !== "string"
  ) {
    return null;
  }

  switch (error.name) {
    case "NotAllowedError":
    case "AbortError":
      return "cancelled";
    case "InvalidStateError":
      return "duplicate";
    case "NotSupportedError":
    case "SecurityError":
      return "unsupported";
    default:
      return "failed";
  }
}
