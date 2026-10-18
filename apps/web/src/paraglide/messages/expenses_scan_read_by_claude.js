/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Read_By_ClaudeInputs */

const en_expenses_scan_read_by_claude = /** @type {(inputs: Expenses_Scan_Read_By_ClaudeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read by Claude, on your Anthropic key.`)
};

const fr_expenses_scan_read_by_claude = /** @type {(inputs: Expenses_Scan_Read_By_ClaudeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lu par Claude, avec votre clé Anthropic.`)
};

/**
* | output |
* | --- |
* | "Read by Claude, on your Anthropic key." |
*
* @param {Expenses_Scan_Read_By_ClaudeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_read_by_claude = /** @type {((inputs?: Expenses_Scan_Read_By_ClaudeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Read_By_ClaudeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_read_by_claude(inputs)
	return en_expenses_scan_read_by_claude(inputs)
});