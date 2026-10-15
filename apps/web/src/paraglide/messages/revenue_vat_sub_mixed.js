/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Vat_Sub_MixedInputs */

const en_revenue_vat_sub_mixed = /** @type {(inputs: Revenue_Vat_Sub_MixedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collected for the State · several rates over the period`)
};

const fr_revenue_vat_sub_mixed = /** @type {(inputs: Revenue_Vat_Sub_MixedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Encaissée pour l'État · plusieurs taux sur la période`)
};

/**
* | output |
* | --- |
* | "Collected for the State · several rates over the period" |
*
* @param {Revenue_Vat_Sub_MixedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_vat_sub_mixed = /** @type {((inputs?: Revenue_Vat_Sub_MixedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Vat_Sub_MixedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_vat_sub_mixed(inputs)
	return en_revenue_vat_sub_mixed(inputs)
});