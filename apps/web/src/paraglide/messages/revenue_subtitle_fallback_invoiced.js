/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Subtitle_Fallback_InvoicedInputs */

const en_revenue_subtitle_fallback_invoiced = /** @type {(inputs: Revenue_Subtitle_Fallback_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing invoiced this month: here is the last period with activity.`)
};

const fr_revenue_subtitle_fallback_invoiced = /** @type {(inputs: Revenue_Subtitle_Fallback_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien de facturé sur le mois en cours : voici la dernière période avec activité.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_subtitle_fallback_invoiced(inputs)
	return en_revenue_subtitle_fallback_invoiced(inputs)
});