import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { Separator } from "@opusline/ui/components/separator";

type DocumentsSectionHeadingProps = {
  children: string;
};

export function DocumentsSectionHeading({
  children,
}: DocumentsSectionHeadingProps) {
  return (
    <div className="flex items-center gap-3">
      <h2 className={eyebrowVariants()}>{children}</h2>
      <Separator className="flex-1" />
    </div>
  );
}
