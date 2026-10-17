/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Reminders_FrequencyInputs */

const en_emails_reminders_frequency = /** @type {(inputs: Emails_Reminders_FrequencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default frequency`)
};

const fr_emails_reminders_frequency = /** @type {(inputs: Emails_Reminders_FrequencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fréquence par défaut`)
};

/**
* | output |
* | --- |
* | "Default frequency" |
*
* @param {Emails_Reminders_FrequencyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_reminders_frequency = /** @type {((inputs?: Emails_Reminders_FrequencyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Reminders_FrequencyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_reminders_frequency(inputs)
	return en_emails_reminders_frequency(inputs)
});