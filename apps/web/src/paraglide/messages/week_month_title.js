/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Month_TitleInputs */

const en_week_month_title = /** @type {(inputs: Week_Month_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Current month`)
};

const fr_week_month_title = /** @type {(inputs: Week_Month_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mois en cours`)
};

/**
* | output |
* | --- |
* | "Current month" |
*
* @param {Week_Month_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_month_title = /** @type {((inputs?: Week_Month_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Month_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_month_title(inputs)
	return en_week_month_title(inputs)
});