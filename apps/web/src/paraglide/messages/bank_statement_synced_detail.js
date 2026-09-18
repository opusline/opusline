/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ start: NonNullable<unknown>, end: NonNullable<unknown>, date: NonNullable<unknown>, lines: NonNullable<unknown> }} Bank_Statement_Synced_DetailInputs */

const en_bank_statement_synced_detail = /** @type {(inputs: Bank_Statement_Synced_DetailInputs) => LocalizedString} */ (i) => {const linesPlural = registry.plural("en", i?.lines, {});
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`${i?.start} → ${i?.end} · ${i?.lines} line · synced on ${i?.date}`);
	if (linesPlural === "other") return /** @type {LocalizedString} */ (`${i?.start} → ${i?.end} · ${i?.lines} lines · synced on ${i?.date}`);
	return /** @type {LocalizedString} */ ("bank_statement_synced_detail");
};

const fr_bank_statement_synced_detail = /** @type {(inputs: Bank_Statement_Synced_DetailInputs) => LocalizedString} */ (i) => {const linesPlural = registry.plural("fr", i?.lines, {});
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`${i?.start} → ${i?.end} · ${i?.lines} ligne · synchronisé le ${i?.date}`);
	if (linesPlural === "other") return /** @type {LocalizedString} */ (`${i?.start} → ${i?.end} · ${i?.lines} lignes · synchronisé le ${i?.date}`);
	return /** @type {LocalizedString} */ ("bank_statement_synced_detail");
};

/**
* | linesPlural | output |
* | --- | --- |
* | "one" | "{start} → {end} · {lines} line · synced on {date}" |
* | "other" | "{start} → {end} · {lines} lines · synced on {date}" |
*
* @param {Bank_Statement_Synced_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_statement_synced_detail = /** @type {((inputs: Bank_Statement_Synced_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Statement_Synced_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_statement_synced_detail(inputs)
	return en_bank_statement_synced_detail(inputs)
});