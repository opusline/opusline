/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Day_TotalInputs */

const en_week_day_total = /** @type {(inputs: Week_Day_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Day total`)
};

const fr_week_day_total = /** @type {(inputs: Week_Day_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total jour`)
};

/**
* | output |
* | --- |
* | "Day total" |
*
* @param {Week_Day_TotalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_day_total = /** @type {((inputs?: Week_Day_TotalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Day_TotalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_day_total(inputs)
	return en_week_day_total(inputs)
});