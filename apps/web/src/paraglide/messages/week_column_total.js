/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Column_TotalInputs */

const en_week_column_total = /** @type {(inputs: Week_Column_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total`)
};

const fr_week_column_total = /** @type {(inputs: Week_Column_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total`)
};

/**
* | output |
* | --- |
* | "Total" |
*
* @param {Week_Column_TotalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_column_total = /** @type {((inputs?: Week_Column_TotalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Column_TotalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_column_total(inputs)
	return en_week_column_total(inputs)
});