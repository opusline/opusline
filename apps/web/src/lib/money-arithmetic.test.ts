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
const SANCTIONED_FILES = [
  "src/lib/billing.ts",
  /**
   * A deliberate mirror of the API's `ExpenseAmounts` and `Rate`: the expense
   * and subscription sheets price a row that does not exist yet, so there is no
   * server figure to ask for, and the HT it shows is the HT the row is stored
   * at. Parity is pinned rather than trusted — `vat.test.ts` drives the same
   * rounding triples the API's `ExpenseAmountsTest` dataset uses, out of
   * `features/expenses/lib/expense-amounts-parity.json`.
   */
  "src/features/expenses/lib/vat.ts",
];

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

/**
 * How money spells itself here: `MoneyData.amount` off a DTO, and the `…Cents`
 * convention every integer minor-unit value in the app is named with. Keying on
 * `.amount` alone let three audits' worth of violations through — better-named
 * code escaped the guard, which is the wrong way round.
 */
const MONEY_PROPERTY = "amount";
const MONEY_NAME = /Cents$|^cents$/i;

function identifierName(node: Node): string | null {
  return node.type === "Identifier" && typeof node.name === "string"
    ? node.name
    : null;
}

/** Whether the expression reads money anywhere inside it. */
function readsMoney(node: Node, moneyLocals: ReadonlySet<string>): boolean {
  if (node.type === "MemberExpression" && isNode(node.property)) {
    const property = identifierName(node.property);

    if (
      property !== null &&
      node.computed !== true &&
      (property === MONEY_PROPERTY || MONEY_NAME.test(property))
    ) {
      return true;
    }

    // A non-computed property name is a label, not a value — a local that
    // happens to share its spelling must not taint `whatever.total`.
    const parts =
      node.computed === true ? [node.object, node.property] : [node.object];

    return parts.some((part) => isNode(part) && readsMoney(part, moneyLocals));
  }

  const name = identifierName(node);

  if (name !== null && (MONEY_NAME.test(name) || moneyLocals.has(name))) {
    return true;
  }

  return childNodes(node).some((child) => readsMoney(child, moneyLocals));
}

function collectDeclarators(node: Node, found: Node[]): Node[] {
  if (node.type === "VariableDeclarator") {
    found.push(node);
  }

  for (const child of childNodes(node)) {
    collectDeclarators(child, found);
  }

  return found;
}

/**
 * Locals holding money, to a fixed point. `const total = points.reduce(…)` one
 * statement above `total / points.length` is the same violation as dividing the
 * `.amount` read inline, and that is how most of them were written.
 */
function moneyLocals(root: Node): Set<string> {
  const declarators = collectDeclarators(root, []);
  const tainted = new Set<string>();

  let grew = true;

  while (grew) {
    grew = false;

    for (const declarator of declarators) {
      if (!isNode(declarator.id) || !isNode(declarator.init)) {
        continue;
      }

      const name = identifierName(declarator.id);

      if (
        name === null ||
        tainted.has(name) ||
        !readsMoney(declarator.init, tainted)
      ) {
        continue;
      }

      tainted.add(name);
      grew = true;
    }
  }

  return tainted;
}

function hasMoneyArithmetic(node: Node, locals: ReadonlySet<string>): boolean {
  if (
    node.type === "BinaryExpression" &&
    RATE_APPLICATION.has(node.operator as string) &&
    isNode(node.left) &&
    isNode(node.right) &&
    (readsMoney(node.left, locals) || readsMoney(node.right, locals))
  ) {
    return true;
  }

  return childNodes(node).some((child) => hasMoneyArithmetic(child, locals));
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

    const ast = parseAst(code) as unknown as Node;

    if (hasMoneyArithmetic(ast, moneyLocals(ast))) {
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
