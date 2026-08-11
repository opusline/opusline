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

const STROKE_WIDTH = 3;

const PRINT_WIDTH = 880;
const PRINT_FALLBACK_HEIGHT = 260;

const PRINT_INK = "#1f1b18";

type Point = { x: number; y: number };

export type SignaturePadHandle = {
  clear: () => void;
  toBlob: () => Promise<Blob | null>;
};

type SignaturePadProps = {
  className?: string;
  label: string;
  placeholder: string;
  onDrawingChange?: (hasDrawing: boolean) => void;
  ref?: Ref<SignaturePadHandle>;
};

function canvasPoint(
  canvas: HTMLCanvasElement,
  event: ReactPointerEvent<HTMLCanvasElement>,
): Point {
  const bounds = canvas.getBoundingClientRect();

  return {
    x: (event.clientX - bounds.left) / bounds.width,
    y: (event.clientY - bounds.top) / bounds.height,
  };
}

function paint(
  ctx: CanvasRenderingContext2D,
  strokes: Point[][],
  ink: string,
  width: number,
  height: number,
  lineWidth: number,
): void {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = ink;

  for (const stroke of strokes) {
    const [first, ...rest] = stroke;

    if (first === undefined) {
      continue;
    }

    ctx.beginPath();
    ctx.moveTo(first.x * width, first.y * height);

    for (const point of rest) {
      ctx.lineTo(point.x * width, point.y * height);
    }

    if (rest.length === 0) {
      // A tap still deserves a mark.
      ctx.lineTo(first.x * width + 0.01, first.y * height);
    }

    ctx.stroke();
  }
}

export function SignaturePad({
  className,
  label,
  placeholder,
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

  const repaint = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    const scale = bounds.width > 0 ? canvas.width / bounds.width : 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paint(
      ctx,
      strokesRef.current,
      getComputedStyle(canvas).color,
      canvas.width,
      canvas.height,
      STROKE_WIDTH * scale,
    );
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(repaint);

    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [repaint]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();

      if (width === 0 || height === 0) {
        return;
      }

      const ratio = window.devicePixelRatio || 1;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      repaint();
    };

    resize();

    const observer = new ResizeObserver(resize);

    observer.observe(canvas);

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
          const canvas = canvasRef.current;

          if (canvas === null) {
            resolve(null);
            return;
          }

          const bounds = canvas.getBoundingClientRect();
          const printable = document.createElement("canvas");

          printable.width = PRINT_WIDTH;
          printable.height =
            bounds.width > 0
              ? Math.round((PRINT_WIDTH * bounds.height) / bounds.width)
              : PRINT_FALLBACK_HEIGHT;

          const ctx = printable.getContext("2d");

          if (ctx === null) {
            resolve(null);
            return;
          }

          paint(
            ctx,
            strokesRef.current,
            PRINT_INK,
            printable.width,
            printable.height,
            STROKE_WIDTH * (bounds.width > 0 ? PRINT_WIDTH / bounds.width : 1),
          );
          printable.toBlob(resolve, "image/png");
        }),
    }),
    [markDrawing, repaint],
  );

  const startStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const point = canvasPoint(canvas, event);

    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    strokesRef.current = [...strokesRef.current, [point]];
    repaint();
  };

  const extendStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const stroke = strokesRef.current.at(-1);

    if (!isDrawingRef.current || canvas === null || stroke === undefined) {
      return;
    }

    const point = canvasPoint(canvas, event);

    stroke.push(point);
    repaint();

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
        onPointerCancel={endStroke}
        onPointerDown={startStroke}
        onPointerLeave={endStroke}
        onPointerMove={extendStroke}
        onPointerUp={endStroke}
        ref={canvasRef}
        role="img"
      />
    </div>
  );
}
