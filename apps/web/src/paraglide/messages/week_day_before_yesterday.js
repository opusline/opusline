/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Day_Before_YesterdayInputs */

const en_week_day_before_yesterday = /** @type {(inputs: Week_Day_Before_YesterdayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Two days ago`)
};

const fr_week_day_before_yesterday = /** @type {(inputs: Week_Day_Before_YesterdayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avant-hier`)
};

/**
* | output |
* | --- |
* | "Two days ago" |
*
* @param {Week_Day_Before_YesterdayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_day_before_yesterday = /** @type {((inputs?: Week_Day_Before_YesterdayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Day_Before_YesterdayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_day_before_yesterday(inputs)
	return en_week_day_before_yesterday(inputs)
});