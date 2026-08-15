/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Reference_LabelInputs */

const en_invoices_reference_label = /** @type {(inputs: Invoices_Reference_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reference`)
};

const fr_invoices_reference_label = /** @type {(inputs: Invoices_Reference_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Référence`)
};

/**
* | output |
* | --- |
* | "Reference" |
*
* @param {Invoices_Reference_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_reference_label = /** @type {((inputs?: Invoices_Reference_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Reference_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_reference_label(inputs)
	return en_invoices_reference_label(inputs)
});