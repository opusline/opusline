import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@opusline/ui/components/card";
import type * as React from "react";

/**
 * The card a route shows when it has nothing else to show: not found, or
 * broken. The caller places it and supplies the way out as children.
 */
export function FallbackCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{hint}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">{children}</CardContent>
    </Card>
  );
}
