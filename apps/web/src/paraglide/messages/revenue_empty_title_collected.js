/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ period: NonNullable<unknown> }} Revenue_Empty_Title_CollectedInputs */

const en_revenue_empty_title_collected = /** @type {(inputs: Revenue_Empty_Title_CollectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Nothing collected in ${i?.period}`)
};

const fr_revenue_empty_title_collected = /** @type {(inputs: Revenue_Empty_Title_CollectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Rien d'encaissé sur ${i?.period}`)
};

/**
* | output |
* | --- |
* | "Nothing collected in {period}" |
*
* @param {Revenue_Empty_Title_CollectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_empty_title_collected = /** @type {((inputs: Revenue_Empty_Title_CollectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Empty_Title_CollectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_empty_title_collected(inputs)
	return en_revenue_empty_title_collected(inputs)
});