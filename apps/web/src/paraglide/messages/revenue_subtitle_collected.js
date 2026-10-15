/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Subtitle_CollectedInputs */

const en_revenue_subtitle_collected = /** @type {(inputs: Revenue_Subtitle_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenue from invoices collected over the period.`)
};

const fr_revenue_subtitle_collected = /** @type {(inputs: Revenue_Subtitle_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chiffre d'affaires des factures encaissées sur la période.`)
};

/**
* | output |
* | --- |
* | "Revenue from invoices collected over the period." |
*
* @param {Revenue_Subtitle_CollectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_subtitle_collected = /** @type {((inputs?: Revenue_Subtitle_CollectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Subtitle_CollectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_subtitle_collected(inputs)
	return en_revenue_subtitle_collected(inputs)
});