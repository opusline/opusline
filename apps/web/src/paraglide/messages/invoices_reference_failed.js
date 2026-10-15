/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Reference_FailedInputs */

const en_invoices_reference_failed = /** @type {(inputs: Invoices_Reference_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The reference could not be saved.`)
};

const fr_invoices_reference_failed = /** @type {(inputs: Invoices_Reference_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La référence n'a pas pu être enregistrée.`)
};

/**
* | output |
* | --- |
* | "The reference could not be saved." |
*
* @param {Invoices_Reference_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_reference_failed = /** @type {((inputs?: Invoices_Reference_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Reference_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_reference_failed(inputs)
	return en_invoices_reference_failed(inputs)
});