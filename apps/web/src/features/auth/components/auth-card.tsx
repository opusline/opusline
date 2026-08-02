import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@opusline/ui/components/card";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Card className="w-full rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-xl">
              <img alt="" className="block size-8" src="/logo.svg" />
              Opusline
            </CardTitle>
            <h1 className="sr-only">{title}</h1>
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
