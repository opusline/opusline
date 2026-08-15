/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Paid_On_LabelInputs */

const en_invoices_paid_on_label = /** @type {(inputs: Invoices_Paid_On_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collected on`)
};

const fr_invoices_paid_on_label = /** @type {(inputs: Invoices_Paid_On_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Encaissée le`)
};

/**
* | output |
* | --- |
* | "Collected on" |
*
* @param {Invoices_Paid_On_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_paid_on_label = /** @type {((inputs?: Invoices_Paid_On_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Paid_On_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_paid_on_label(inputs)
	return en_invoices_paid_on_label(inputs)
});