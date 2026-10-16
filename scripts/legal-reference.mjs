// Rolls apps/api/config/legal-reference.json over to the semester in force.
// Run by .github/workflows/legal-reference.yml from 1 January and 1 July:
//
//   node scripts/legal-reference.mjs [--today=YYYY-MM-DD]
//
// The ECB main refinancing rate in force on the semester's first day comes
// from the ECB Data API. The taux de l'intérêt légal is fixed by an arrêté
// that no open API publishes, so it is left as it was: the workflow opens its
// PR as a draft that asks for it. Prints `changed=true|false` and
// `semester=…` for $GITHUB_OUTPUT; a file already on the current semester is
// left untouched.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ECB_MRO_SERIES =
  "https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.4F.KR.MRR_FR.LEV";

/** The semester holding `today` (a YYYY-MM-DD string), its first day and the next one's. */
export function semesterOf(today) {
  const [year, month] = today.split("-").map(Number);
  const isFirstHalf = month <= 6;

  return {
    semester: `${year}-${isFirstHalf ? "H1" : "H2"}`,
    startsOn: `${year}-${isFirstHalf ? "01" : "07"}-01`,
    nextRevisionOn: isFirstHalf ? `${year}-07-01` : `${year + 1}-01-01`,
  };
}

/** The last observation of an ECB `csvdata` response, in basis points. */
export function lastRateBp(csv) {
  const [header, ...rows] = csv.trim().split(/\r?\n/);
  const column = header.split(",").indexOf("OBS_VALUE");
  const value = Number.parseFloat(rows.at(-1)?.split(",")[column] ?? "");

  if (column === -1 || Number.isNaN(value)) {
    throw new Error(`No rate in the ECB response:\n${csv}`);
  }

  return Math.round(value * 100);
}

async function ecbRateBpOn(date) {
  const url = `${ECB_MRO_SERIES}?endPeriod=${date}&lastNObservations=1&format=csvdata`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} answered ${response.status}`);
  }

  return lastRateBp(await response.text());
}

async function main() {
  const file = join(
    dirname(fileURLToPath(import.meta.url)),
    "../apps/api/config/legal-reference.json",
  );
  const todayArgument = process.argv
    .find((argument) => argument.startsWith("--today="))
    ?.slice("--today=".length);
  const today = todayArgument ?? new Date().toISOString().slice(0, 10);
  const target = semesterOf(today);
  const reference = JSON.parse(readFileSync(file, "utf8"));

  console.log(`semester=${target.semester}`);

  if (reference.semester === target.semester) {
    console.log("changed=false");
    return;
  }

  const updated = {
    ...reference,
    semester: target.semester,
    checked_on: today,
    next_revision_on: target.nextRevisionOn,
    ecb_rate_bp: await ecbRateBpOn(target.startsOn),
  };

  writeFileSync(file, `${JSON.stringify(updated, null, 2)}\n`);
  console.log(`ecb_rate_bp=${updated.ecb_rate_bp}`);
  console.log("changed=true");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  await main();
}
