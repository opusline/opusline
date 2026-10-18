/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Claude_UnreadableInputs */

const en_expenses_scan_claude_unreadable = /** @type {(inputs: Expenses_Scan_Claude_UnreadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claude could not read this file, so it was read without Claude.`)
};

const fr_expenses_scan_claude_unreadable = /** @type {(inputs: Expenses_Scan_Claude_UnreadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claude n'a pas pu lire ce fichier : il a été lu sans Claude.`)
};

/**
* | output |
* | --- |
* | "Claude could not read this file, so it was read without Claude." |
*
* @param {Expenses_Scan_Claude_UnreadableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_claude_unreadable = /** @type {((inputs?: Expenses_Scan_Claude_UnreadableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Claude_UnreadableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_claude_unreadable(inputs)
	return en_expenses_scan_claude_unreadable(inputs)
});