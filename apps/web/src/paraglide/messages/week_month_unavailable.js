/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Month_UnavailableInputs */

const en_week_month_unavailable = /** @type {(inputs: Week_Month_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not be loaded`)
};

const fr_week_month_unavailable = /** @type {(inputs: Week_Month_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chargement impossible`)
};

/**
* | output |
* | --- |
* | "Could not be loaded" |
*
* @param {Week_Month_UnavailableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_month_unavailable = /** @type {((inputs?: Week_Month_UnavailableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Month_UnavailableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_month_unavailable(inputs)
	return en_week_month_unavailable(inputs)
});