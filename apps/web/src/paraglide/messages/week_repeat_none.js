/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Repeat_NoneInputs */

const en_week_repeat_none = /** @type {(inputs: Week_Repeat_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No entries to copy from last week.`)
};

const fr_week_repeat_none = /** @type {(inputs: Week_Repeat_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune entrée à reprendre sur la semaine précédente.`)
};

/**
* | output |
* | --- |
* | "No entries to copy from last week." |
*
* @param {Week_Repeat_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_repeat_none = /** @type {((inputs?: Week_Repeat_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Repeat_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_repeat_none(inputs)
	return en_week_repeat_none(inputs)
});