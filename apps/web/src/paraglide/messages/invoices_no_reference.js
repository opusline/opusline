/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_No_ReferenceInputs */

const en_invoices_no_reference = /** @type {(inputs: Invoices_No_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No reference`)
};

const fr_invoices_no_reference = /** @type {(inputs: Invoices_No_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sans référence`)
};

/**
* | output |
* | --- |
* | "No reference" |
*
* @param {Invoices_No_ReferenceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_no_reference = /** @type {((inputs?: Invoices_No_ReferenceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_No_ReferenceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_no_reference(inputs)
	return en_invoices_no_reference(inputs)
});