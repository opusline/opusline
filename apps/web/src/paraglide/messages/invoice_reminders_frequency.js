/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Reminders_FrequencyInputs */

const en_invoice_reminders_frequency = /** @type {(inputs: Invoice_Reminders_FrequencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Frequency`)
};

const fr_invoice_reminders_frequency = /** @type {(inputs: Invoice_Reminders_FrequencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fréquence`)
};

/**
* | output |
* | --- |
* | "Frequency" |
*
* @param {Invoice_Reminders_FrequencyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_reminders_frequency = /** @type {((inputs?: Invoice_Reminders_FrequencyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Reminders_FrequencyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_reminders_frequency(inputs)
	return en_invoice_reminders_frequency(inputs)
});