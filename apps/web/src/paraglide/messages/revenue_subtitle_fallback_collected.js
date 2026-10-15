/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Subtitle_Fallback_CollectedInputs */

const en_revenue_subtitle_fallback_collected = /** @type {(inputs: Revenue_Subtitle_Fallback_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing collected this month: here is the last period with activity.`)
};

const fr_revenue_subtitle_fallback_collected = /** @type {(inputs: Revenue_Subtitle_Fallback_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien d'encaissé sur le mois en cours : voici la dernière période avec activité.`)
};

/**
* | output |
* | --- |
* | "Nothing collected this month: here is the last period with activity." |
*
* @param {Revenue_Subtitle_Fallback_CollectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_subtitle_fallback_collected = /** @type {((inputs?: Revenue_Subtitle_Fallback_CollectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Subtitle_Fallback_CollectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_subtitle_fallback_collected(inputs)
	return en_revenue_subtitle_fallback_collected(inputs)
});