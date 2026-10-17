/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reminder_Frequency_Once_Day_AfterInputs */

const en_reminder_frequency_once_day_after = /** @type {(inputs: Reminder_Frequency_Once_Day_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Once, the day after the due date`)
};

const fr_reminder_frequency_once_day_after = /** @type {(inputs: Reminder_Frequency_Once_Day_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une fois, le lendemain de l'échéance`)
};

/**
* | output |
* | --- |
* | "Once, the day after the due date" |
*
* @param {Reminder_Frequency_Once_Day_AfterInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const reminder_frequency_once_day_after = /** @type {((inputs?: Reminder_Frequency_Once_Day_AfterInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reminder_Frequency_Once_Day_AfterInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_reminder_frequency_once_day_after(inputs)
	return en_reminder_frequency_once_day_after(inputs)
});