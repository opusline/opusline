/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_AnotherInputs */

const en_expenses_scan_another = /** @type {(inputs: Expenses_Scan_AnotherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Another receipt`)
};

const fr_expenses_scan_another = /** @type {(inputs: Expenses_Scan_AnotherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autre facture`)
};

/**
* | output |
* | --- |
* | "Another receipt" |
*
* @param {Expenses_Scan_AnotherInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_another = /** @type {((inputs?: Expenses_Scan_AnotherInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_AnotherInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_another(inputs)
	return en_expenses_scan_another(inputs)
});