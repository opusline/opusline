/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Skin_Billed_DayInputs */

const en_week_skin_billed_day = /** @type {(inputs: Week_Skin_Billed_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Day billed at the TJM`)
};

const fr_week_skin_billed_day = /** @type {(inputs: Week_Skin_Billed_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jour facturé au TJM`)
};

/**
* | output |
* | --- |
* | "Day billed at the TJM" |
*
* @param {Week_Skin_Billed_DayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_skin_billed_day = /** @type {((inputs?: Week_Skin_Billed_DayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Skin_Billed_DayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_skin_billed_day(inputs)
	return en_week_skin_billed_day(inputs)
});