/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_HintInputs */

const en_expenses_scan_hint = /** @type {(inputs: Expenses_Scan_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check the fields, then save.`)
};

const fr_expenses_scan_hint = /** @type {(inputs: Expenses_Scan_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vérifiez les champs, puis enregistrez.`)
};

/**
* | output |
* | --- |
* | "Check the fields, then save." |
*
* @param {Expenses_Scan_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_hint = /** @type {((inputs?: Expenses_Scan_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_hint(inputs)
	return en_expenses_scan_hint(inputs)
});