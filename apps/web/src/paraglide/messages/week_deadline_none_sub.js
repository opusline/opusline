/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Deadline_None_SubInputs */

const en_week_deadline_none_sub = /** @type {(inputs: Week_Deadline_None_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no fiscal deadline on the calendar`)
};

const fr_week_deadline_none_sub = /** @type {(inputs: Week_Deadline_None_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucune échéance fiscale au calendrier`)
};

/**
* | output |
* | --- |
* | "no fiscal deadline on the calendar" |
*
* @param {Week_Deadline_None_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_deadline_none_sub = /** @type {((inputs?: Week_Deadline_None_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Deadline_None_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_deadline_none_sub(inputs)
	return en_week_deadline_none_sub(inputs)
});