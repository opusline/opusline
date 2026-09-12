/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Source_ReadInputs */

const en_expenses_scan_source_read = /** @type {(inputs: Expenses_Scan_Source_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· read from the receipt`)
};

const fr_expenses_scan_source_read = /** @type {(inputs: Expenses_Scan_Source_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· lu sur la facture`)
};

/**
* | output |
* | --- |
* | "· read from the receipt" |
*
* @param {Expenses_Scan_Source_ReadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_source_read = /** @type {((inputs?: Expenses_Scan_Source_ReadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Source_ReadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_source_read(inputs)
	return en_expenses_scan_source_read(inputs)
});