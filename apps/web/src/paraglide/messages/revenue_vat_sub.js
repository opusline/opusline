/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Revenue_Vat_SubInputs */

const en_revenue_vat_sub = /** @type {(inputs: Revenue_Vat_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`VAT ${i?.rate} % · collected for the State`)
};

const fr_revenue_vat_sub = /** @type {(inputs: Revenue_Vat_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA ${i?.rate} % · encaissée pour l'État`)
};

/**
* | output |
* | --- |
* | "VAT {rate} % · collected for the State" |
*
* @param {Revenue_Vat_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_vat_sub = /** @type {((inputs: Revenue_Vat_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Vat_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_vat_sub(inputs)
	return en_revenue_vat_sub(inputs)
});