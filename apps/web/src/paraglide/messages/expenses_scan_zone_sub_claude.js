/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Zone_Sub_ClaudeInputs */

const en_expenses_scan_zone_sub_claude = /** @type {(inputs: Expenses_Scan_Zone_Sub_ClaudeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF or photo · Claude reads the supplier, date, amounts and TVA`)
};

const fr_expenses_scan_zone_sub_claude = /** @type {(inputs: Expenses_Scan_Zone_Sub_ClaudeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF ou photo · Claude lit le fournisseur, la date, les montants et la TVA`)
};

/**
* | output |
* | --- |
* | "PDF or photo · Claude reads the supplier, date, amounts and TVA" |
*
* @param {Expenses_Scan_Zone_Sub_ClaudeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_zone_sub_claude = /** @type {((inputs?: Expenses_Scan_Zone_Sub_ClaudeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Zone_Sub_ClaudeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_zone_sub_claude(inputs)
	return en_expenses_scan_zone_sub_claude(inputs)
});