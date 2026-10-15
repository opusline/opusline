/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_Fill_LabelInputs */

const en_invoices_add_fill_label = /** @type {(inputs: Invoices_Add_Fill_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fill in:`)
};

const fr_invoices_add_fill_label = /** @type {(inputs: Invoices_Add_Fill_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remplir :`)
};

/**
* | output |
* | --- |
* | "Fill in:" |
*
* @param {Invoices_Add_Fill_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_fill_label = /** @type {((inputs?: Invoices_Add_Fill_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Fill_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_fill_label(inputs)
	return en_invoices_add_fill_label(inputs)
});