/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Change_MissionInputs */

const en_week_change_mission = /** @type {(inputs: Week_Change_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change`)
};

const fr_week_change_mission = /** @type {(inputs: Week_Change_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changer`)
};

/**
* | output |
* | --- |
* | "Change" |
*
* @param {Week_Change_MissionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_change_mission = /** @type {((inputs?: Week_Change_MissionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Change_MissionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_change_mission(inputs)
	return en_week_change_mission(inputs)
});