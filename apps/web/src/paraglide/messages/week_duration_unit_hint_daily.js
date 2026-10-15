/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Duration_Unit_Hint_DailyInputs */



/**
* | output |
* | --- |
* | "In days — 0.5 for half a day. Add “h” to enter hours." |
*
* @param {Week_Duration_Unit_Hint_DailyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_duration_unit_hint_daily = /** @type {((inputs?: Week_Duration_Unit_Hint_DailyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Duration_Unit_Hint_DailyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("En jours — 0,5 pour une demi-journée. Ajoutez « h » pour saisir en heures.")
	return /** @type {LocalizedString} */ ("In days — 0.5 for half a day. Add “h” to enter hours.")
});