import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import { demoRowNamed } from "../lib/week-fixtures";
import type {
  LiveCell,
  WeekCell as WeekCellModel,
  WeekRow,
} from "../lib/week-grid";
import { WeekCell } from "./week-cell";

const billedDayRow = demoRowNamed("Orvella front");
const hourlyRow = demoRowNamed("Vesterhus maintenance");
const nonBillableRow = demoRowNamed("Opusline");

/** Cells only ever render inside a grid row, so the preview supplies one. */
function CellPreview(props: {
  row: WeekRow;
  cell: WeekCellModel;
  editor?: { draft: string; error: string | null };
  live?: LiveCell;
}) {
  const editorRef = useRef<HTMLInputElement>(null);

  return (
    // biome-ignore lint/a11y/useSemanticElements: mirrors the ARIA grid the cell lives in.
    <div className="w-44 rounded-md border bg-card" role="grid">
      {/* biome-ignore lint/a11y/useSemanticElements: mirrors the ARIA grid the cell lives in. */}
      <div role="row" tabIndex={-1}>
        <WeekCell
          cell={props.cell}
          cellRef={() => undefined}
          columnIndex={0}
          editor={props.editor ?? null}
          live={props.live ?? null}
          editorRef={editorRef}
          isActive={false}
          isFocused={false}
          isPending={false}
          onActivate={() => {}}
          onCellKeyDown={() => {}}
          onDraftBlur={() => {}}
          onDraftChange={() => {}}
          onDraftKeyDown={() => {}}
          row={props.row}
        />
      </div>
    </div>
  );
}

const meta = {
  title: "Web/Week/WeekCell",
  component: CellPreview,
  tags: ["autodocs"],
} satisfies Meta<typeof CellPreview>;

export default meta;
type Story = StoryObj<typeof CellPreview>;

export const BilledDay: Story = {
  args: { cell: billedDayRow.cells[0], row: billedDayRow },
};

export const Hours: Story = {
  args: { cell: hourlyRow.cells[2], row: hourlyRow },
};

export const NonBillable: Story = {
  args: { cell: nonBillableRow.cells[1], row: nonBillableRow },
};

export const Empty: Story = {
  args: { cell: hourlyRow.cells[0], row: hourlyRow },
};

export const Editing: Story = {
  args: {
    cell: billedDayRow.cells[0],
    editor: { draft: "0,5", error: null },
    row: billedDayRow,
  },
};

export const EditingInvalid: Story = {
  args: {
    cell: billedDayRow.cells[0],
    editor: { draft: "beaucoup", error: "Format : 1 · 0,5 · 2h · 1h30 · 90m" },
    row: billedDayRow,
  },
};

const runningTimer: LiveCell = {
  billedLabel: "0,5 j",
  clockLabel: "07:20:24",
  date: "2026-07-27",
  isRunning: true,
  missionId: hourlyRow.missionId,
  onStop: () => undefined,
};

export const TimerRunning: Story = {
  args: { cell: hourlyRow.cells[0], live: runningTimer, row: hourlyRow },
};

export const TimerPaused: Story = {
  args: {
    cell: hourlyRow.cells[0],
    live: { ...runningTimer, clockLabel: "07:20:38", isRunning: false },
    row: hourlyRow,
  },
};

export const TimerAlongsideAnEntry: Story = {
  args: {
    cell: billedDayRow.cells[0],
    live: { ...runningTimer, missionId: billedDayRow.missionId },
    row: billedDayRow,
  },
};

export const SeveralEntries: Story = {
  args: {
    cell: {
      ...billedDayRow.cells[0],
      billedLabel: "1 j",
      entries: [
        { billable: true, durationMinutes: 210, id: 1, note: "Revue PR" },
        { billable: true, durationMinutes: 210, id: 2, note: "Cadrage" },
      ],
      note: null,
    },
    row: billedDayRow,
  },
};
