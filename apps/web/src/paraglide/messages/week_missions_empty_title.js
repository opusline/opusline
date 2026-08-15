/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Missions_Empty_TitleInputs */

const en_week_missions_empty_title = /** @type {(inputs: Week_Missions_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing to track yet`)
};

const fr_week_missions_empty_title = /** @type {(inputs: Week_Missions_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien à suivre pour l'instant`)
};

/**
* | output |
* | --- |
* | "Nothing to track yet" |
*
* @param {Week_Missions_Empty_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_missions_empty_title = /** @type {((inputs?: Week_Missions_Empty_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Missions_Empty_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_missions_empty_title(inputs)
	return en_week_missions_empty_title(inputs)
});