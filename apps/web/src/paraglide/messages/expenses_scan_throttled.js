/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_ThrottledInputs */

const en_expenses_scan_throttled = /** @type {(inputs: Expenses_Scan_ThrottledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Too many receipts read in a row. Wait a minute, then try again.`)
};

const fr_expenses_scan_throttled = /** @type {(inputs: Expenses_Scan_ThrottledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trop de factures lues d'affilée. Patientez une minute, puis réessayez.`)
};

/**
* | output |
* | --- |
* | "Too many receipts read in a row. Wait a minute, then try again." |
*
* @param {Expenses_Scan_ThrottledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_throttled = /** @type {((inputs?: Expenses_Scan_ThrottledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_ThrottledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_throttled(inputs)
	return en_expenses_scan_throttled(inputs)
});