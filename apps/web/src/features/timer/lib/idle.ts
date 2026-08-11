export const IDLE_THRESHOLD_SECONDS = 20 * 60;

export type IdleSpan = {
  seconds: number;
  endedAt: number;
};

export type IdleNotice = {
  idleSeconds: number;
  idleMinutes: number;
  key: number;
};

export type IdleInput = {
  dismissedIdleAt: number | null;
  isRunning: boolean;
  lastActivityAt: number;
  now: number;
  recordedSpan: IdleSpan | null;
};

function noticeOf(seconds: number, key: number): IdleNotice {
  return { idleMinutes: Math.floor(seconds / 60), idleSeconds: seconds, key };
}

export function idleNotice({
  dismissedIdleAt,
  isRunning,
  lastActivityAt,
  now,
  recordedSpan,
}: IdleInput): IdleNotice | null {
  if (!isRunning) {
    return null;
  }

  const ongoingSeconds = Math.floor((now - lastActivityAt) / 1000);

  if (
    ongoingSeconds >= IDLE_THRESHOLD_SECONDS &&
    dismissedIdleAt !== lastActivityAt
  ) {
    return noticeOf(ongoingSeconds, lastActivityAt);
  }

  if (recordedSpan !== null && dismissedIdleAt !== recordedSpan.endedAt) {
    return noticeOf(recordedSpan.seconds, recordedSpan.endedAt);
  }

  return null;
}

export function trimSeconds(
  idleSeconds: number,
  elapsedSeconds: number,
): number {
  return Math.max(1, Math.min(86_400, idleSeconds, elapsedSeconds));
}
