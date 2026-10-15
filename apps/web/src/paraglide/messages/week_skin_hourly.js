/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Skin_HourlyInputs */

const en_week_skin_hourly = /** @type {(inputs: Week_Skin_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hours`)
};

const fr_week_skin_hourly = /** @type {(inputs: Week_Skin_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Heures`)
};

/**
* | output |
* | --- |
* | "Hours" |
*
* @param {Week_Skin_HourlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_skin_hourly = /** @type {((inputs?: Week_Skin_HourlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Skin_HourlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_skin_hourly(inputs)
	return en_week_skin_hourly(inputs)
});