import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@opusline/ui/components/card";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  /**
   * A step that needs explaining shows its title under the brand, with this
   * line beneath it; without one the title is only announced.
   */
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Card className="w-full [--card-spacing:--spacing(8)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-xl">
              <img alt="" className="block size-8" src="/logo.svg" />
              Opusline
            </CardTitle>
            {description === undefined ? (
              <h1 className="sr-only">{title}</h1>
            ) : (
              <>
                <h1 className="mt-5 font-heading font-semibold text-foreground-hi text-lg">
                  {title}
                </h1>
                <CardDescription className="text-muted-foreground-3">
                  {description}
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        {footer ? (
          <p className="mt-4 text-center text-muted-foreground text-sm">
            {footer}
          </p>
        ) : null}
      </div>
    </main>
  );
}
