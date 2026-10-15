/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notifications_Deadline_Reminders_LabelInputs */



/**
* | output |
* | --- |
* | "Deadline reminders" |
*
* @param {Notifications_Deadline_Reminders_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const notifications_deadline_reminders_label = /** @type {((inputs?: Notifications_Deadline_Reminders_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notifications_Deadline_Reminders_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Rappels d'échéances")
	return /** @type {LocalizedString} */ ("Deadline reminders")
});