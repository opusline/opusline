/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Upcoming_EmptyInputs */

const en_deadlines_upcoming_empty = /** @type {(inputs: Deadlines_Upcoming_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing on the calendar. Check your fiscal settings if that surprises you.`)
};

const fr_deadlines_upcoming_empty = /** @type {(inputs: Deadlines_Upcoming_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien au calendrier. Vérifiez vos réglages fiscaux si cela vous surprend.`)
};

/**
* | output |
* | --- |
* | "Nothing on the calendar. Check your fiscal settings if that surprises you." |
*
* @param {Deadlines_Upcoming_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_upcoming_empty = /** @type {((inputs?: Deadlines_Upcoming_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Upcoming_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_upcoming_empty(inputs)
	return en_deadlines_upcoming_empty(inputs)
});