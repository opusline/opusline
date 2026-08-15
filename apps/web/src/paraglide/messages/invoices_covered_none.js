/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Covered_NoneInputs */

const en_invoices_covered_none = /** @type {(inputs: Invoices_Covered_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No tracked time will be attached to this invoice.`)
};

const fr_invoices_covered_none = /** @type {(inputs: Invoices_Covered_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun temps ne sera rattaché à cette facture.`)
};

/**
* | output |
* | --- |
* | "No tracked time will be attached to this invoice." |
*
* @param {Invoices_Covered_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_covered_none = /** @type {((inputs?: Invoices_Covered_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Covered_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_covered_none(inputs)
	return en_invoices_covered_none(inputs)
});