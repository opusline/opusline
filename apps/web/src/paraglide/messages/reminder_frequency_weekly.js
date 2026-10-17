/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reminder_Frequency_WeeklyInputs */

const en_reminder_frequency_weekly = /** @type {(inputs: Reminder_Frequency_WeeklyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every week until paid`)
};

const fr_reminder_frequency_weekly = /** @type {(inputs: Reminder_Frequency_WeeklyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chaque semaine jusqu'au paiement`)
};

/**
* | output |
* | --- |
* | "Every week until paid" |
*
* @param {Reminder_Frequency_WeeklyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const reminder_frequency_weekly = /** @type {((inputs?: Reminder_Frequency_WeeklyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reminder_Frequency_WeeklyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_reminder_frequency_weekly(inputs)
	return en_reminder_frequency_weekly(inputs)
});