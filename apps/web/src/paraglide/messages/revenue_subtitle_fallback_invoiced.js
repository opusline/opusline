/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Subtitle_Fallback_InvoicedInputs */



/**
* | output |
* | --- |
* | "Nothing invoiced this month: here is the last period with activity." |
*
* @param {Revenue_Subtitle_Fallback_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_subtitle_fallback_invoiced = /** @type {((inputs?: Revenue_Subtitle_Fallback_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Subtitle_Fallback_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Rien de facturé sur le mois en cours : voici la dernière période avec activité.")
	return /** @type {LocalizedString} */ ("Nothing invoiced this month: here is the last period with activity.")
});