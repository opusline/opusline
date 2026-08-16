/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ quarter: NonNullable<unknown>, year: NonNullable<unknown> }} Revenue_Quarter_TitleInputs */

const en_revenue_quarter_title = /** @type {(inputs: Revenue_Quarter_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Q${i?.quarter} ${i?.year}`)
};

const fr_revenue_quarter_title = /** @type {(inputs: Revenue_Quarter_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`T${i?.quarter} ${i?.year}`)
};

/**
* | output |
* | --- |
* | "Q{quarter} {year}" |
*
* @param {Revenue_Quarter_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_quarter_title = /** @type {((inputs: Revenue_Quarter_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Quarter_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_quarter_title(inputs)
	return en_revenue_quarter_title(inputs)
});