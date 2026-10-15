/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Upcoming_Empty_TitleInputs */

const en_deadlines_upcoming_empty_title = /** @type {(inputs: Deadlines_Upcoming_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing on the calendar`)
};

const fr_deadlines_upcoming_empty_title = /** @type {(inputs: Deadlines_Upcoming_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien au calendrier`)
};

/**
* | output |
* | --- |
* | "Nothing on the calendar" |
*
* @param {Deadlines_Upcoming_Empty_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_upcoming_empty_title = /** @type {((inputs?: Deadlines_Upcoming_Empty_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Upcoming_Empty_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_upcoming_empty_title(inputs)
	return en_deadlines_upcoming_empty_title(inputs)
});