import type {
  TrustedDeviceData,
  TwoFactorStatusData,
} from "@opusline/api-client";

export const trustedDevicesFixture: TrustedDeviceData[] = [
  {
    id: 1,
    browser: "Chrome",
    platform: "macOS",
    lastUsedAt: "2026-09-08T09:12:00+00:00",
    expiresAt: "2026-10-08T09:12:00+00:00",
    current: true,
  },
  {
    id: 2,
    browser: "Firefox",
    platform: "Linux",
    lastUsedAt: "2026-09-05T18:40:00+00:00",
    expiresAt: "2026-10-05T18:40:00+00:00",
    current: false,
  },
  {
    id: 3,
    browser: null,
    platform: null,
    lastUsedAt: null,
    expiresAt: "2026-09-30T08:00:00+00:00",
    current: false,
  },
];

export const twoFactorOffFixture: TwoFactorStatusData = {
  totpEnabled: false,
  totpConfirmedAt: null,
  recoveryCodesRemaining: 0,
  trustedDevices: [],
};

export const twoFactorOnFixture: TwoFactorStatusData = {
  totpEnabled: true,
  totpConfirmedAt: "2026-08-20T14:03:00+00:00",
  recoveryCodesRemaining: 8,
  trustedDevices: trustedDevicesFixture,
};

export const recoveryCodesFixture = [
  "k4F7mQ2pL9-a8Zr3Tn6Wx",
  "Vb2Hs9Jq1M-c7Yd4Ke8Pz",
  "Rt5Nw3Xg6B-h1Lm9Qv2Sc",
  "Zp8Ck4Dj7F-u3Ha6Nb1Ye",
  "Mq1Ws5Ef9G-t2Kj8Lr4Xv",
  "Hd6Pn2Bt3C-y9Vz7Gm5Ka",
  "Jx9Lr4Ms8Q-e1Wf6Tc3Nb",
  "Ck3Yv7Hq2Z-p5Dg1Rs9Lm",
];

export const totpSetupFixture = {
  secret: "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP",
  otpauthUri:
    "otpauth://totp/Opusline:theo%40marchand.dev?secret=JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP&issuer=Opusline",
};
