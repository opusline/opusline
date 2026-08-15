/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Issued_On_LabelInputs */

const en_invoices_issued_on_label = /** @type {(inputs: Invoices_Issued_On_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Issued on`)
};

const fr_invoices_issued_on_label = /** @type {(inputs: Invoices_Issued_On_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Émise le`)
};

/**
* | output |
* | --- |
* | "Issued on" |
*
* @param {Invoices_Issued_On_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_issued_on_label = /** @type {((inputs?: Invoices_Issued_On_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Issued_On_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_issued_on_label(inputs)
	return en_invoices_issued_on_label(inputs)
});