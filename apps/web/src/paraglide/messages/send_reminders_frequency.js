/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Reminders_FrequencyInputs */

const en_send_reminders_frequency = /** @type {(inputs: Send_Reminders_FrequencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Frequency`)
};

const fr_send_reminders_frequency = /** @type {(inputs: Send_Reminders_FrequencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fréquence`)
};

/**
* | output |
* | --- |
* | "Frequency" |
*
* @param {Send_Reminders_FrequencyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_reminders_frequency = /** @type {((inputs?: Send_Reminders_FrequencyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Reminders_FrequencyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_reminders_frequency(inputs)
	return en_send_reminders_frequency(inputs)
});