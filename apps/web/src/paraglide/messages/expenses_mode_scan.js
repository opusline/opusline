/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Mode_ScanInputs */

const en_expenses_mode_scan = /** @type {(inputs: Expenses_Mode_ScanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From the receipt`)
};

const fr_expenses_mode_scan = /** @type {(inputs: Expenses_Mode_ScanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Depuis la facture`)
};

/**
* | output |
* | --- |
* | "From the receipt" |
*
* @param {Expenses_Mode_ScanInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_mode_scan = /** @type {((inputs?: Expenses_Mode_ScanInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Mode_ScanInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_mode_scan(inputs)
	return en_expenses_mode_scan(inputs)
});