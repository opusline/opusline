/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Reader_ClaudeInputs */

const en_expenses_scan_reader_claude = /** @type {(inputs: Expenses_Scan_Reader_ClaudeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claude`)
};

const fr_expenses_scan_reader_claude = /** @type {(inputs: Expenses_Scan_Reader_ClaudeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claude`)
};

/**
* | output |
* | --- |
* | "Claude" |
*
* @param {Expenses_Scan_Reader_ClaudeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_reader_claude = /** @type {((inputs?: Expenses_Scan_Reader_ClaudeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Reader_ClaudeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_reader_claude(inputs)
	return en_expenses_scan_reader_claude(inputs)
});