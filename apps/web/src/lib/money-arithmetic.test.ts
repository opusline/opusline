import { readdirSync, readFileSync } from "node:fs";

import { parseAst, transformWithOxc } from "vite";
import { expect, it } from "vitest";

/**
 * Money is integer minor units, computed once server-side with one explicit
 * rounding mode. The browser formats it and never applies a rate to it: a day
 * fraction is a float, and two screens that each derive the same figure end up
 * disagreeing by cents.
 *
 * `lib/billing.ts` is the one sanctioned exception — the `/100` every formatter
 * needs, and the projections that have no server figure to ask for.
 */
const SANCTIONED_FILES = ["src/lib/billing.ts"];

/**
 * Multiplication and division only. Adding or subtracting two same-currency
 * integer amounts is exact and invents nothing. Applying a *rate* needs a figure
 * the API holds and a rounding decision it already made.
 */
const RATE_APPLICATION = new Set(["*", "/", "%"]);

/** Vitest runs with the workspace as its root. */
const webRoot = `${process.cwd()}/`;

type Node = { type: string; [key: string]: unknown };

function isNode(value: unknown): value is Node {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Node).type === "string"
  );
}

function childNodes(node: Node): Node[] {
  return Object.values(node).flatMap((value) => {
    if (Array.isArray(value)) {
      return value.filter(isNode);
    }

    return isNode(value) ? [value] : [];
  });
}

/** Whether the expression reads a `.amount` property anywhere inside it. */
function readsMoneyAmount(node: Node): boolean {
  if (
    node.type === "MemberExpression" &&
    isNode(node.property) &&
    node.property.type === "Identifier" &&
    node.property.name === "amount"
  ) {
    return true;
  }

  return childNodes(node).some(readsMoneyAmount);
}

function hasMoneyArithmetic(node: Node): boolean {
  if (
    node.type === "BinaryExpression" &&
    RATE_APPLICATION.has(node.operator as string) &&
    isNode(node.left) &&
    isNode(node.right) &&
    (readsMoneyAmount(node.left) || readsMoneyAmount(node.right))
  ) {
    return true;
  }

  return childNodes(node).some(hasMoneyArithmetic);
}

/** Hand-written sources, as paths relative to the workspace root. */
function sourceFiles(): string[] {
  return readdirSync(`${webRoot}/src`, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name))
    .map((entry) => `${entry.parentPath}/${entry.name}`.slice(webRoot.length))
    .filter(
      (file) =>
        // Compiled message catalogs, and the tests that assert on money figures.
        !file.startsWith("src/paraglide/") &&
        !/\.test\.tsx?$/.test(file) &&
        !SANCTIONED_FILES.includes(file),
    )
    .sort();
}

it("applies no rate to a money amount outside lib/billing.ts", async () => {
  const offenders: string[] = [];

  for (const file of sourceFiles()) {
    // Types are stripped first, so a `number - 1` inside a type annotation and
    // the TSX syntax itself never reach the JS parser.
    const { code } = await transformWithOxc(
      readFileSync(`${webRoot}/${file}`, "utf8"),
      `${webRoot}/${file}`,
    );

    if (hasMoneyArithmetic(parseAst(code) as unknown as Node)) {
      offenders.push(file);
    }
  }

  expect(
    offenders,
    "The API computes money; the browser formats it. Ask the API for the figure — " +
      "add a field to the DTO if it does not carry one yet — or, when it genuinely " +
      "cannot be known server-side, put the computation in lib/billing.ts with a " +
      "test and a reason.",
  ).toEqual([]);
});
