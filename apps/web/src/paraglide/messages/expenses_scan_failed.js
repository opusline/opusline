/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_FailedInputs */

const en_expenses_scan_failed = /** @type {(inputs: Expenses_Scan_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The receipt could not be read.`)
};

const fr_expenses_scan_failed = /** @type {(inputs: Expenses_Scan_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La facture n'a pas pu être lue.`)
};

/**
* | output |
* | --- |
* | "The receipt could not be read." |
*
* @param {Expenses_Scan_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_failed = /** @type {((inputs?: Expenses_Scan_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_failed(inputs)
	return en_expenses_scan_failed(inputs)
});