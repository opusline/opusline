/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Vat_TitleInputs */

const en_revenue_vat_title = /** @type {(inputs: Revenue_Vat_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT collected`)
};

const fr_revenue_vat_title = /** @type {(inputs: Revenue_Vat_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA collectée`)
};

/**
* | output |
* | --- |
* | "VAT collected" |
*
* @param {Revenue_Vat_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_vat_title = /** @type {((inputs?: Revenue_Vat_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Vat_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_vat_title(inputs)
	return en_revenue_vat_title(inputs)
});