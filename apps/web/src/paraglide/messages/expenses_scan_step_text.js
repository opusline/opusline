/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Step_TextInputs */

const en_expenses_scan_step_text = /** @type {(inputs: Expenses_Scan_Step_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Extracting the text…`)
};

const fr_expenses_scan_step_text = /** @type {(inputs: Expenses_Scan_Step_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Extraction du texte…`)
};

/**
* | output |
* | --- |
* | "Extracting the text…" |
*
* @param {Expenses_Scan_Step_TextInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_step_text = /** @type {((inputs?: Expenses_Scan_Step_TextInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Step_TextInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_step_text(inputs)
	return en_expenses_scan_step_text(inputs)
});