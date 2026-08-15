export function compareVersions(a: string, b: string): number {
  const left = a.split(".").map(Number);
  const right = b.split(".").map(Number);

  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const difference = (left[i] ?? 0) - (right[i] ?? 0);
    if (difference !== 0) {
      return Math.sign(difference);
    }
  }

  return 0;
}

export function isReleaseUnread(
  version: string,
  seenVersion: string | null,
): boolean {
  return seenVersion === null || compareVersions(version, seenVersion) > 0;
}

export type ReleaseType = "major" | "minor" | "patch";

export function releaseType(version: string): ReleaseType {
  const [, minor = 0, patch = 0] = version.split(".").map(Number);

  if (patch > 0) {
    return "patch";
  }

  return minor > 0 ? "minor" : "major";
}
