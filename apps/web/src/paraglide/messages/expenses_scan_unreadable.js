/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ file: NonNullable<unknown> }} Expenses_Scan_UnreadableInputs */

const en_expenses_scan_unreadable = /** @type {(inputs: Expenses_Scan_UnreadableInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No readable text in ${i?.file}`)
};

const fr_expenses_scan_unreadable = /** @type {(inputs: Expenses_Scan_UnreadableInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Aucun texte lisible dans ${i?.file}`)
};

/**
* | output |
* | --- |
* | "No readable text in {file}" |
*
* @param {Expenses_Scan_UnreadableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_unreadable = /** @type {((inputs: Expenses_Scan_UnreadableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_UnreadableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_unreadable(inputs)
	return en_expenses_scan_unreadable(inputs)
});