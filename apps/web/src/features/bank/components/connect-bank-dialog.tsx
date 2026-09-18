import type { BankAspspData, BankPsuType } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Label } from "@opusline/ui/components/label";
import { NativeSelect } from "@opusline/ui/components/native-select";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useId, useState } from "react";

import { m } from "@/paraglide/messages.js";
import { bankPsuTypeLabel } from "../lib/connection";

export type ConnectBankSubmit = { aspspName: string; psuType: BankPsuType };

type ConnectBankDialogProps = {
  open: boolean;
  /** Undefined while the list loads. */
  banks: BankAspspData[] | undefined;
  /** Preselected on a reconnection: the bank the consent was given at. */
  defaultBankName: string | null;
  isStarting: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (choice: ConnectBankSubmit) => void;
};

/** Picks the bank to authorize at, before the browser leaves for it. */
export function ConnectBankDialog({
  open,
  banks,
  defaultBankName,
  isStarting,
  error,
  onOpenChange,
  onSubmit,
}: ConnectBankDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <ConnectBankForm
            banks={banks}
            defaultBankName={defaultBankName}
            error={error}
            isStarting={isStarting}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type ConnectBankFormProps = Omit<
  ConnectBankDialogProps,
  "open" | "onOpenChange"
>;

function ConnectBankForm({
  banks,
  defaultBankName,
  isStarting,
  error,
  onSubmit,
}: ConnectBankFormProps) {
  const bankFieldId = useId();
  const psuLabelId = useId();
  const [bankName, setBankName] = useState(defaultBankName ?? "");
  const [chosenPsuType, setChosenPsuType] = useState<BankPsuType>(0);

  const bank = banks?.find((candidate) => candidate.name === bankName);
  // A bank offering one login only leaves nothing to choose.
  const psuType =
    bank === undefined || bank.psuTypes.includes(chosenPsuType)
      ? chosenPsuType
      : (bank.psuTypes[0] ?? chosenPsuType);

  return (
    <form
      data-testid="bank-connect-dialog"
      onSubmit={(event) => {
        event.preventDefault();

        if (bank !== undefined) {
          onSubmit({ aspspName: bank.name, psuType });
        }
      }}
    >
      <DialogHeader>
        <DialogTitle size="lg">{m.bank_connect_title()}</DialogTitle>
        <DialogDescription className="text-pretty text-sm">
          {m.bank_connect_description()}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={bankFieldId} size="md">
            {m.bank_connect_bank_label()}
          </Label>
          {banks === undefined ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <NativeSelect
              data-testid="bank-connect-aspsp"
              id={bankFieldId}
              onChange={(event) => setBankName(event.target.value)}
              value={bankName}
            >
              <option disabled value="">
                {m.bank_connect_bank_placeholder()}
              </option>
              {banks.map((candidate) => (
                <option key={candidate.name} value={candidate.name}>
                  {candidate.name}
                </option>
              ))}
            </NativeSelect>
          )}
        </div>

        {bank !== undefined && bank.psuTypes.length > 1 && (
          <div className="flex flex-col gap-1.5">
            <Label id={psuLabelId} size="md">
              {m.bank_connect_psu_label()}
            </Label>
            <SegmentedControl
              aria-labelledby={psuLabelId}
              data-testid="bank-connect-psu"
              onValueChange={(value) => {
                const next = Number(value[0]);

                if (next === 0 || next === 1) {
                  setChosenPsuType(next);
                }
              }}
              value={[String(psuType)]}
            >
              {bank.psuTypes.map((type) => (
                <SegmentedControlItem key={type} value={String(type)}>
                  {bankPsuTypeLabel(type)}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          </div>
        )}

        {bank?.isBeta && (
          <p className="text-muted-foreground-3 text-xs leading-relaxed">
            {m.bank_connect_beta()}
          </p>
        )}
      </div>

      {error !== null && (
        <Alert className="mt-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <DialogFooter className="mt-5">
        <DialogClose render={<Button size="xl" variant="outline" />}>
          {m.common_cancel()}
        </DialogClose>
        <Button
          data-testid="bank-connect-submit"
          disabled={bank === undefined || isStarting}
          size="xl"
          type="submit"
        >
          {m.bank_connect_submit()}
        </Button>
      </DialogFooter>
    </form>
  );
}
