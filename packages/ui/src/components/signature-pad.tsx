import { Input } from "@opusline/ui/components/input";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
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

const TYPED_MAX_WIDTH_RATIO = 0.85;
const TYPED_FONT_HEIGHT_RATIO = 0.32;

type Point = { x: number; y: number };

type SignatureMode = "draw" | "type";

export type SignaturePadHandle = {
  clear: () => void;
  toBlob: () => Promise<Blob | null>;
};

type SignaturePadProps = {
  className?: string;
  /** Names the pad as a whole; the canvas itself carries nothing to read. */
  label: string;
  placeholder: string;
  /** Announced once strokes exist, since the canvas cannot report them. */
  drawnLabel: string;
  /** Which input method the pad opens on; the toggle can always switch. */
  defaultMode?: SignatureMode;
  modeToggleLabel?: string;
  drawModeLabel?: string;
  typeModeLabel?: string;
  typedLabel?: string;
  typedPlaceholder?: string;
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

function paintStrokes(
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

function typedFont(size: number): string {
  return `italic ${size}px "Lora Variable", serif`;
}

function paintTypedName(
  ctx: CanvasRenderingContext2D,
  name: string,
  ink: string,
  width: number,
  height: number,
): void {
  const maxWidth = width * TYPED_MAX_WIDTH_RATIO;
  let fontSize = height * TYPED_FONT_HEIGHT_RATIO;

  ctx.font = typedFont(fontSize);

  const measuredWidth = ctx.measureText(name).width;

  if (measuredWidth > maxWidth) {
    fontSize *= maxWidth / measuredWidth;
    ctx.font = typedFont(fontSize);
  }

  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name, width / 2, height / 2);
}

export function SignaturePad({
  className,
  label,
  placeholder,
  drawnLabel,
  defaultMode = "draw",
  modeToggleLabel = "Méthode de signature",
  drawModeLabel = "Dessiner",
  typeModeLabel = "Saisir au clavier",
  typedLabel = "Nom apposé comme signature",
  typedPlaceholder = "Votre nom",
  onDrawingChange,
  ref,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Point[][]>([]);
  const isDrawingRef = useRef(false);
  const [mode, setMode] = useState<SignatureMode>(defaultMode);
  const [typedName, setTypedName] = useState("");
  const [hasDrawing, setHasDrawing] = useState(false);

  const markDrawing = useCallback(
    (next: boolean) => {
      setHasDrawing(next);
      onDrawingChange?.(next);
    },
    [onDrawingChange],
  );

  const hasInk = (nextMode: SignatureMode, name: string): boolean =>
    nextMode === "draw"
      ? strokesRef.current.length > 0
      : name.trim().length > 0;

  const repaint = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    const scale = bounds.width > 0 ? canvas.width / bounds.width : 1;
    const ink = getComputedStyle(canvas).color;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mode === "draw") {
      paintStrokes(
        ctx,
        strokesRef.current,
        ink,
        canvas.width,
        canvas.height,
        STROKE_WIDTH * scale,
      );
    } else if (typedName.trim() !== "") {
      paintTypedName(ctx, typedName.trim(), ink, canvas.width, canvas.height);
    }
  }, [mode, typedName]);

  // The observers below live for the component's lifetime; they reach the
  // latest repaint through this ref so a keystroke in the name field does not
  // tear them down and rebuild them (the ResizeObserver's setup clears the
  // canvas and forces a layout).
  const repaintRef = useRef(repaint);

  useEffect(() => {
    repaintRef.current = repaint;
    repaint();
  }, [repaint]);

  useEffect(() => {
    // The canvas does not reflow when Lora finishes loading, so the first
    // typed paint may land in the fallback serif; repaint once fonts settle.
    void document.fonts?.ready.then(() => repaintRef.current());

    const observer = new MutationObserver(() => repaintRef.current());

    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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
      repaintRef.current();
    };

    resize();

    const observer = new ResizeObserver(resize);

    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      clear: () => {
        strokesRef.current = [];
        setTypedName("");
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

          if (mode === "draw") {
            paintStrokes(
              ctx,
              strokesRef.current,
              PRINT_INK,
              printable.width,
              printable.height,
              STROKE_WIDTH *
                (bounds.width > 0 ? PRINT_WIDTH / bounds.width : 1),
            );
          } else if (typedName.trim() !== "") {
            paintTypedName(
              ctx,
              typedName.trim(),
              PRINT_INK,
              printable.width,
              printable.height,
            );
          }

          printable.toBlob(resolve, "image/png");
        }),
    }),
    [markDrawing, repaint, mode, typedName],
  );

  const changeMode = (value: unknown[]) => {
    const next = value[0];

    if (next === "draw" || next === "type") {
      setMode(next);
      markDrawing(hasInk(next, typedName));
    }
  };

  const changeTypedName = (name: string) => {
    setTypedName(name);
    markDrawing(hasInk("type", name));
  };

  const startStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (canvas === null || mode !== "draw") {
      return;
    }

    const point = canvasPoint(canvas, event);

    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    strokesRef.current = [...strokesRef.current, [point]];
    markDrawing(true);
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
  };

  const endStroke = () => {
    isDrawingRef.current = false;
  };

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <SegmentedControl
        aria-label={modeToggleLabel}
        className="self-start"
        onValueChange={changeMode}
        value={[mode]}
      >
        <SegmentedControlItem value="draw">
          {drawModeLabel}
        </SegmentedControlItem>
        <SegmentedControlItem value="type">
          {typeModeLabel}
        </SegmentedControlItem>
      </SegmentedControl>
      {mode === "type" && (
        <Input
          aria-label={typedLabel}
          onChange={(event) => changeTypedName(event.target.value)}
          placeholder={typedPlaceholder}
          value={typedName}
        />
      )}
      <figure
        aria-label={label}
        className="relative overflow-hidden rounded-md border border-border-3 border-dashed bg-muted"
      >
        {mode === "draw" && !hasDrawing ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-muted-foreground-5 text-sm">
            {placeholder}
          </div>
        ) : null}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6.5 bottom-8.5 h-px bg-border"
        />
        <canvas
          aria-hidden
          className={cn(
            "block h-47.5 w-full touch-none text-foreground",
            mode === "draw" ? "cursor-crosshair" : "pointer-events-none",
          )}
          onPointerCancel={endStroke}
          onPointerDown={startStroke}
          onPointerMove={extendStroke}
          onPointerUp={endStroke}
          ref={canvasRef}
        />
      </figure>
      <p className="sr-only" role="status">
        {mode === "draw" && hasDrawing ? drawnLabel : null}
      </p>
    </div>
  );
}
