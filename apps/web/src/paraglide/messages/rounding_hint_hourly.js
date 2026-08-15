/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rounding_Hint_HourlyInputs */

const en_rounding_hint_hourly = /** @type {(inputs: Rounding_Hint_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each tracked time is rounded to the chosen step before being valued in hours. With 15 min, 1 h 07 tracked counts as 1 h 15; with 30 min, it counts as 1 h 30. With minutes, time is valued exactly, without rounding.`)
};

const fr_rounding_hint_hourly = /** @type {(inputs: Rounding_Hint_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chaque temps saisi est arrondi au pas choisi avant d'être valorisé en heures. Avec 15 min, 1 h 07 pointée compte 1 h 15 ; avec 30 min, elle compte 1 h 30. En minutes, le temps est valorisé exactement, sans arrondi.`)
};

/**
* | output |
* | --- |
* | "Each tracked time is rounded to the chosen step before being valued in hours. With 15 min, 1 h 07 tracked counts as 1 h 15; with 30 min, it counts as 1 h 30...." |
*
* @param {Rounding_Hint_HourlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const rounding_hint_hourly = /** @type {((inputs?: Rounding_Hint_HourlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rounding_Hint_HourlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_rounding_hint_hourly(inputs)
	return en_rounding_hint_hourly(inputs)
});