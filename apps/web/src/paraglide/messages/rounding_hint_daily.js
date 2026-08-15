/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rounding_Hint_DailyInputs */

const en_rounding_hint_daily = /** @type {(inputs: Rounding_Hint_DailyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each tracked time is rounded to the chosen step before being valued in days. With 0.5 d, 3 h tracked count as half a day and 5 h count as a full day; with 0.25 d, precision moves to the quarter-day. With minutes, time is valued exactly, without rounding.`)
};

const fr_rounding_hint_daily = /** @type {(inputs: Rounding_Hint_DailyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chaque temps saisi est arrondi au pas choisi avant d'être valorisé en jours. Avec 0,5 j, 3 h pointées comptent une demi-journée et 5 h comptent une journée ; avec 0,25 j, la précision passe au quart de journée. En minutes, le temps est valorisé exactement, sans arrondi.`)
};

/**
* | output |
* | --- |
* | "Each tracked time is rounded to the chosen step before being valued in days. With 0.5 d, 3 h tracked count as half a day and 5 h count as a full day; with 0...." |
*
* @param {Rounding_Hint_DailyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const rounding_hint_daily = /** @type {((inputs?: Rounding_Hint_DailyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rounding_Hint_DailyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_rounding_hint_daily(inputs)
	return en_rounding_hint_daily(inputs)
});