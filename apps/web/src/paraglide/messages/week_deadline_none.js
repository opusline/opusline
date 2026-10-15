/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Deadline_NoneInputs */

const en_week_deadline_none = /** @type {(inputs: Week_Deadline_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing due`)
};

const fr_week_deadline_none = /** @type {(inputs: Week_Deadline_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien à venir`)
};

/**
* | output |
* | --- |
* | "Nothing due" |
*
* @param {Week_Deadline_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_deadline_none = /** @type {((inputs?: Week_Deadline_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Deadline_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_deadline_none(inputs)
	return en_week_deadline_none(inputs)
});