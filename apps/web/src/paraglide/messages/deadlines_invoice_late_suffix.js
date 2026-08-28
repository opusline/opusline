/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Invoice_Late_SuffixInputs */

const en_deadlines_invoice_late_suffix = /** @type {(inputs: Deadlines_Invoice_Late_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`past due`)
};

const fr_deadlines_invoice_late_suffix = /** @type {(inputs: Deadlines_Invoice_Late_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`échéance dépassée`)
};

/**
* | output |
* | --- |
* | "past due" |
*
* @param {Deadlines_Invoice_Late_SuffixInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_invoice_late_suffix = /** @type {((inputs?: Deadlines_Invoice_Late_SuffixInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Invoice_Late_SuffixInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_invoice_late_suffix(inputs)
	return en_deadlines_invoice_late_suffix(inputs)
});