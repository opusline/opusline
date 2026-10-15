/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_TodayInputs */

const en_week_today = /** @type {(inputs: Week_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Today`)
};

const fr_week_today = /** @type {(inputs: Week_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aujourd'hui`)
};

/**
* | output |
* | --- |
* | "Today" |
*
* @param {Week_TodayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_today = /** @type {((inputs?: Week_TodayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_TodayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_today(inputs)
	return en_week_today(inputs)
});