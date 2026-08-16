/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ start: NonNullable<unknown>, end: NonNullable<unknown>, date: NonNullable<unknown>, lines: NonNullable<unknown> }} Bank_Statement_DetailInputs */

const en_bank_statement_detail = /** @type {(inputs: Bank_Statement_DetailInputs) => LocalizedString} */ (i) => {const linesPlural = registry.plural("en", i?.lines, {});
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`${i?.start} → ${i?.end} · ${i?.lines} line · imported on ${i?.date}`);
	if (linesPlural === "other") return /** @type {LocalizedString} */ (`${i?.start} → ${i?.end} · ${i?.lines} lines · imported on ${i?.date}`);
	return /** @type {LocalizedString} */ ("bank_statement_detail");
};

const fr_bank_statement_detail = /** @type {(inputs: Bank_Statement_DetailInputs) => LocalizedString} */ (i) => {const linesPlural = registry.plural("fr", i?.lines, {});
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`${i?.start} → ${i?.end} · ${i?.lines} ligne · importé le ${i?.date}`);
	if (linesPlural === "other") return /** @type {LocalizedString} */ (`${i?.start} → ${i?.end} · ${i?.lines} lignes · importé le ${i?.date}`);
	return /** @type {LocalizedString} */ ("bank_statement_detail");
};

/**
* | linesPlural | output |
* | --- | --- |
* | "one" | "{start} → {end} · {lines} line · imported on {date}" |
* | "other" | "{start} → {end} · {lines} lines · imported on {date}" |
*
* @param {Bank_Statement_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_statement_detail = /** @type {((inputs: Bank_Statement_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Statement_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_statement_detail(inputs)
	return en_bank_statement_detail(inputs)
});