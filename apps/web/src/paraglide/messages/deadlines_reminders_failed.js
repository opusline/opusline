/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Reminders_FailedInputs */



/**
* | output |
* | --- |
* | "The reminders could not be marked as read." |
*
* @param {Deadlines_Reminders_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_reminders_failed = /** @type {((inputs?: Deadlines_Reminders_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Reminders_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Les rappels n’ont pas pu être marqués comme lus.")
	return /** @type {LocalizedString} */ ("The reminders could not be marked as read.")
});