/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Vat_ChipInputs */

const en_revenue_vat_chip = /** @type {(inputs: Revenue_Vat_ChipInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`not yours`)
};

const fr_revenue_vat_chip = /** @type {(inputs: Revenue_Vat_ChipInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`pas à vous`)
};

/**
* | output |
* | --- |
* | "not yours" |
*
* @param {Revenue_Vat_ChipInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_vat_chip = /** @type {((inputs?: Revenue_Vat_ChipInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Vat_ChipInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_vat_chip(inputs)
	return en_revenue_vat_chip(inputs)
});