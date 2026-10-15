/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Calendar_Rotate_FailedInputs */



/**
* | output |
* | --- |
* | "The address could not be renewed." |
*
* @param {Deadlines_Calendar_Rotate_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_calendar_rotate_failed = /** @type {((inputs?: Deadlines_Calendar_Rotate_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Calendar_Rotate_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("L’adresse n’a pas pu être renouvelée.")
	return /** @type {LocalizedString} */ ("The address could not be renewed.")
});