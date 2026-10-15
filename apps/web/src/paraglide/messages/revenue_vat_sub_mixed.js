/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Vat_Sub_MixedInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Encaissée pour l'État · plusieurs taux sur la période")
	return /** @type {LocalizedString} */ ("Collected for the State · several rates over the period")
});