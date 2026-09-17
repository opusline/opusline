/**
 * Tracking specs browse a fixed week in the past rather than freezing the
 * clock: the server keeps its own time, and would refuse a timer the browser
 * claims ran for longer than it saw. March 2026 holds no French public holiday.
 */
export const ANCHOR_WEEK = "2026-W10";
export const ANCHOR_MONDAY = "2026-03-02";
