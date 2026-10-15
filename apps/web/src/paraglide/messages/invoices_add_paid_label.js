/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_Paid_LabelInputs */

const en_invoices_add_paid_label = /** @type {(inputs: Invoices_Add_Paid_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paid on`)
};

const fr_invoices_add_paid_label = /** @type {(inputs: Invoices_Add_Paid_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payée le`)
};

/**
* | output |
* | --- |
* | "Paid on" |
*
* @param {Invoices_Add_Paid_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_paid_label = /** @type {((inputs?: Invoices_Add_Paid_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Paid_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_paid_label(inputs)
	return en_invoices_add_paid_label(inputs)
});