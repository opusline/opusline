import { cn } from "@opusline/ui/lib/utils";
import {
  type PointerEvent as ReactPointerEvent,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const CANVAS_WIDTH = 880;
const CANVAS_HEIGHT = 260;
const STROKE_WIDTH = 3;

const PRINT_INK = "#1f1b18";

type Point = { x: number; y: number };

export type SignaturePadHandle = {
  clear: () => void;
  toBlob: () => Promise<Blob | null>;
};

type SignaturePadProps = {
  className?: string;
  label?: string;
  placeholder?: string;
  onDrawingChange?: (hasDrawing: boolean) => void;
  ref?: Ref<SignaturePadHandle>;
};

function canvasPoint(
  canvas: HTMLCanvasElement,
  event: ReactPointerEvent<HTMLCanvasElement>,
): Point {
  const bounds = canvas.getBoundingClientRect();

  return {
    x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
    y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
  };
}

function paint(
  ctx: CanvasRenderingContext2D,
  strokes: Point[][],
  ink: string,
): void {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = STROKE_WIDTH;
  ctx.strokeStyle = ink;

  for (const stroke of strokes) {
    const [first, ...rest] = stroke;

    if (first === undefined) {
      continue;
    }

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (const point of rest) {
      ctx.lineTo(point.x, point.y);
    }

    if (rest.length === 0) {
      // A tap still deserves a mark.
      ctx.lineTo(first.x + 0.01, first.y);
    }

    ctx.stroke();
  }
}

export function SignaturePad({
  className,
  label = "Zone de signature",
  placeholder = "Tracez votre signature ici",
  onDrawingChange,
  ref,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Point[][]>([]);
  const isDrawingRef = useRef(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  const markDrawing = useCallback(
    (next: boolean) => {
      setHasDrawing(next);
      onDrawingChange?.(next);
    },
    [onDrawingChange],
  );

  const screenInk = () =>
    canvasRef.current === null
      ? PRINT_INK
      : getComputedStyle(canvasRef.current).color;

  const repaint = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paint(ctx, strokesRef.current, getComputedStyle(canvas).color);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(repaint);

    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [repaint]);

  useImperativeHandle(
    ref,
    () => ({
      clear: () => {
        strokesRef.current = [];
        repaint();
        markDrawing(false);
      },
      toBlob: () =>
        new Promise<Blob | null>((resolve) => {
          const printable = document.createElement("canvas");

          printable.width = CANVAS_WIDTH;
          printable.height = CANVAS_HEIGHT;

          const ctx = printable.getContext("2d");

          if (ctx === null) {
            resolve(null);
            return;
          }

          paint(ctx, strokesRef.current, PRINT_INK);
          printable.toBlob(resolve, "image/png");
        }),
    }),
    [markDrawing, repaint],
  );

  const startStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return;
    }

    const point = canvasPoint(canvas, event);

    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    strokesRef.current = [...strokesRef.current, [point]];

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = STROKE_WIDTH;
    ctx.strokeStyle = screenInk();
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const extendStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const stroke = strokesRef.current.at(-1);

    if (!isDrawingRef.current || !canvas || !ctx || stroke === undefined) {
      return;
    }

    const point = canvasPoint(canvas, event);

    stroke.push(point);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    if (!hasDrawing) {
      markDrawing(true);
    }
  };

  const endStroke = () => {
    isDrawingRef.current = false;
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-border-3 border-dashed bg-muted",
        className,
      )}
    >
      {hasDrawing ? null : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-muted-foreground-5 text-sm">
          {placeholder}
        </div>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6.5 bottom-8.5 h-px bg-border"
      />
      <canvas
        aria-label={label}
        className="block h-47.5 w-full cursor-crosshair touch-none text-foreground"
        height={CANVAS_HEIGHT}
        onPointerCancel={endStroke}
        onPointerDown={startStroke}
        onPointerLeave={endStroke}
        onPointerMove={extendStroke}
        onPointerUp={endStroke}
        ref={canvasRef}
        role="img"
        width={CANVAS_WIDTH}
      />
    </div>
  );
}
