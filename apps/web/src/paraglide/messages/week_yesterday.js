/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_YesterdayInputs */

const en_week_yesterday = /** @type {(inputs: Week_YesterdayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yesterday`)
};

const fr_week_yesterday = /** @type {(inputs: Week_YesterdayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hier`)
};

/**
* | output |
* | --- |
* | "Yesterday" |
*
* @param {Week_YesterdayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_yesterday = /** @type {((inputs?: Week_YesterdayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_YesterdayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_yesterday(inputs)
	return en_week_yesterday(inputs)
});