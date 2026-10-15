/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Mission_Step_TitleInputs */

const en_week_mission_step_title = /** @type {(inputs: Week_Mission_Step_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Which mission?`)
};

const fr_week_mission_step_title = /** @type {(inputs: Week_Mission_Step_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sur quelle mission ?`)
};

/**
* | output |
* | --- |
* | "Which mission?" |
*
* @param {Week_Mission_Step_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_mission_step_title = /** @type {((inputs?: Week_Mission_Step_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Mission_Step_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_mission_step_title(inputs)
	return en_week_mission_step_title(inputs)
});