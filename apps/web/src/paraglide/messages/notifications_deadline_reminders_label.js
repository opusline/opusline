/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notifications_Deadline_Reminders_LabelInputs */

const en_notifications_deadline_reminders_label = /** @type {(inputs: Notifications_Deadline_Reminders_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deadline reminders`)
};

const fr_notifications_deadline_reminders_label = /** @type {(inputs: Notifications_Deadline_Reminders_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rappels d'échéances`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notifications_deadline_reminders_label(inputs)
	return en_notifications_deadline_reminders_label(inputs)
});