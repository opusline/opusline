import { useEffect, useRef, useState } from "react";

import { IDLE_THRESHOLD_SECONDS, type IdleSpan } from "./idle";

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel"] as const;

export type Activity = {
  lastActivityAt: () => number;
  idleSpan: IdleSpan | null;
  clearIdleSpan: () => void;
};

export function useActivity(): Activity {
  const lastActivityAt = useRef(Date.now());
  const [idleSpan, setIdleSpan] = useState<IdleSpan | null>(null);

  useEffect(() => {
    const record = () => {
      const now = Date.now();
      const seconds = Math.floor((now - lastActivityAt.current) / 1000);

      lastActivityAt.current = now;

      if (seconds >= IDLE_THRESHOLD_SECONDS) {
        setIdleSpan({ endedAt: now, seconds });
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        record();
      }
    };

    for (const name of ACTIVITY_EVENTS) {
      window.addEventListener(name, record, { passive: true });
    }

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      for (const name of ACTIVITY_EVENTS) {
        window.removeEventListener(name, record);
      }

      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return {
    clearIdleSpan: () => setIdleSpan(null),
    idleSpan,
    lastActivityAt: () => lastActivityAt.current,
  };
}
