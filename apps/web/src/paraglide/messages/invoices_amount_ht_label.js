/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Amount_Ht_LabelInputs */

const en_invoices_amount_ht_label = /** @type {(inputs: Invoices_Amount_Ht_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount HT`)
};

const fr_invoices_amount_ht_label = /** @type {(inputs: Invoices_Amount_Ht_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant HT`)
};

/**
* | output |
* | --- |
* | "Amount HT" |
*
* @param {Invoices_Amount_Ht_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_amount_ht_label = /** @type {((inputs?: Invoices_Amount_Ht_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Amount_Ht_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_amount_ht_label(inputs)
	return en_invoices_amount_ht_label(inputs)
});