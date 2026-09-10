/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Sent_On_LabelInputs */

const en_invoices_sent_on_label = /** @type {(inputs: Invoices_Sent_On_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent on`)
};

const fr_invoices_sent_on_label = /** @type {(inputs: Invoices_Sent_On_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyée le`)
};

/**
* | output |
* | --- |
* | "Sent on" |
*
* @param {Invoices_Sent_On_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_sent_on_label = /** @type {((inputs?: Invoices_Sent_On_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Sent_On_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_sent_on_label(inputs)
	return en_invoices_sent_on_label(inputs)
});