import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@opusline/ui/components/tooltip";
import { cn } from "@opusline/ui/lib/utils";
import type { ComponentProps } from "react";

const WIDTH = 420;
const HEIGHT = 100;
const INSET_X = 12;
const INSET_Y = 8;

type SparklinePoint = {
  label: string;
  value: number;
};

type SparklineProps = Omit<ComponentProps<"div">, "children"> & {
  points: SparklinePoint[];
  /** How a value reads next to the marker and in each point's tooltip. */
  format: (value: number) => string;
  /** The point to mark and caption; the last one by default. */
  markerIndex?: number;
  /** Names the chart for assistive tech; the points are listed under it. */
  "aria-label": string;
};

function coordinates(points: SparklinePoint[]): Array<[number, number]> {
  const ceiling = Math.max(...points.map((point) => point.value), 0) * 1.1;
  const step =
    points.length > 1 ? (WIDTH - INSET_X * 2) / (points.length - 1) : 0;

  return points.map((point, index) => [
    INSET_X + index * step,
    ceiling === 0
      ? HEIGHT - INSET_Y
      : HEIGHT - INSET_Y - (point.value / ceiling) * (HEIGHT - INSET_Y * 2.5),
  ]);
}

/**
 * A twelve-point trend with an area under the line and one marked point. The
 * SVG stretches to its box (`preserveAspectRatio="none"`), so the marker dot
 * and its caption are HTML laid over it rather than shapes that would squash
 * with the drawing. Every point is a focusable target with its own tooltip,
 * which is also how the values reach assistive tech.
 */
function Sparkline({
  "aria-label": ariaLabel,
  className,
  format,
  markerIndex,
  points,
  ...props
}: SparklineProps) {
  const dots = coordinates(points);
  const marker = markerIndex ?? points.length - 1;
  const path = dots
    .map(
      ([x, y], index) =>
        `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`,
    )
    .join(" ");
  const first = dots[0];
  const last = dots[dots.length - 1];
  const area =
    first === undefined || last === undefined
      ? ""
      : `${path} L${last[0].toFixed(1)} ${HEIGHT - 4} L${first[0].toFixed(1)} ${HEIGHT - 4} Z`;
  const marked = dots[marker];
  const markedPoint = points[marker];

  return (
    <div
      data-slot="sparkline"
      className={cn("relative h-27.5 w-full", className)}
      {...props}
    >
      <svg
        aria-hidden
        className="block size-full"
        preserveAspectRatio="none"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <title>{ariaLabel}</title>
        {area !== "" && <path className="fill-primary/10" d={area} />}
        {path !== "" && (
          <path
            className="stroke-primary"
            d={path}
            fill="none"
            strokeLinejoin="round"
            strokeWidth={1.8}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {marked !== undefined && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-1 border-border-4 border-l"
          style={{ left: `${(marked[0] / WIDTH) * 100}%` }}
        />
      )}
      {marked !== undefined && markedPoint !== undefined && (
        <div
          aria-hidden
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${(marked[0] / WIDTH) * 100}%`,
            top: `${(marked[1] / HEIGHT) * 100}%`,
          }}
        >
          <span className="block size-2 rounded-full bg-primary-text ring-2 ring-card" />
          <span className="absolute right-2.5 bottom-2.5 whitespace-nowrap font-mono text-primary-text text-xs">
            {format(markedPoint.value)}
          </span>
        </div>
      )}
      <ol aria-label={ariaLabel} className="absolute inset-0 m-0 list-none p-0">
        {points.map((point, index) => {
          const [x, y] = dots[index] ?? [0, 0];

          return (
            <li key={point.label}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      aria-label={`${point.label} · ${format(point.value)}`}
                      className="absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-primary-text"
                      style={{
                        left: `${(x / WIDTH) * 100}%`,
                        top: `${(y / HEIGHT) * 100}%`,
                      }}
                      type="button"
                    />
                  }
                />
                <TooltipContent>
                  {point.label} · {format(point.value)}
                </TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export { Sparkline, type SparklinePoint };
