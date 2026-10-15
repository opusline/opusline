/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Feed_Reminders_LabelInputs */

const en_deadlines_feed_reminders_label = /** @type {(inputs: Deadlines_Feed_Reminders_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reminders to send`)
};

const fr_deadlines_feed_reminders_label = /** @type {(inputs: Deadlines_Feed_Reminders_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Relances à envoyer`)
};

/**
* | output |
* | --- |
* | "Reminders to send" |
*
* @param {Deadlines_Feed_Reminders_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_feed_reminders_label = /** @type {((inputs?: Deadlines_Feed_Reminders_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Feed_Reminders_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_feed_reminders_label(inputs)
	return en_deadlines_feed_reminders_label(inputs)
});