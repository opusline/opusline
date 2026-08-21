import { Separator } from "@opusline/ui/components/separator";

type DocumentsSectionHeadingProps = {
  children: string;
};

export function DocumentsSectionHeading({
  children,
}: DocumentsSectionHeadingProps) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
        {children}
      </h2>
      <Separator className="flex-1" />
    </div>
  );
}
