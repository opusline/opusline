/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Duration_Unit_Hint_HourlyInputs */

const en_week_duration_unit_hint_hourly = /** @type {(inputs: Week_Duration_Unit_Hint_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`In hours — 1.5 for an hour and a half. Add “j” to enter days.`)
};

const fr_week_duration_unit_hint_hourly = /** @type {(inputs: Week_Duration_Unit_Hint_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En heures — 1,5 pour une heure et demie. Ajoutez « j » pour saisir en jours.`)
};

/**
* | output |
* | --- |
* | "In hours — 1.5 for an hour and a half. Add “j” to enter days." |
*
* @param {Week_Duration_Unit_Hint_HourlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_duration_unit_hint_hourly = /** @type {((inputs?: Week_Duration_Unit_Hint_HourlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Duration_Unit_Hint_HourlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_duration_unit_hint_hourly(inputs)
	return en_week_duration_unit_hint_hourly(inputs)
});