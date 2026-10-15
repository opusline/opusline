/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Breakdown_TitleInputs */

const en_revenue_breakdown_title = /** @type {(inputs: Revenue_Breakdown_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Where the revenue comes from`)
};

const fr_revenue_breakdown_title = /** @type {(inputs: Revenue_Breakdown_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`D'où vient le chiffre d'affaires`)
};

/**
* | output |
* | --- |
* | "Where the revenue comes from" |
*
* @param {Revenue_Breakdown_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_breakdown_title = /** @type {((inputs?: Revenue_Breakdown_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Breakdown_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_breakdown_title(inputs)
	return en_revenue_breakdown_title(inputs)
});