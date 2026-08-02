import { Card } from "@opusline/ui/components/card";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        <Card className="w-full gap-0 rounded-lg p-8">
          <div className="mb-6 flex items-center gap-2.5">
            <img alt="" className="block size-[34px]" src="/logo.svg" />
            <span className="font-heading font-semibold text-[19px] text-card-foreground">
              Opusline
            </span>
          </div>
          <h1 className="sr-only">{title}</h1>
          {children}
        </Card>
        {footer ? (
          <p className="mt-4 text-center text-[13px] text-muted-foreground">
            {footer}
          </p>
        ) : null}
      </div>
    </main>
  );
}
