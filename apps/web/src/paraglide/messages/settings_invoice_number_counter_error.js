/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Invoice_Number_Counter_ErrorInputs */



/**
* | output |
* | --- |
* | "The format must contain exactly one NNN counter." |
*
* @param {Settings_Invoice_Number_Counter_ErrorInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_invoice_number_counter_error = /** @type {((inputs?: Settings_Invoice_Number_Counter_ErrorInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Invoice_Number_Counter_ErrorInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Le format doit contenir un seul compteur NNN.")
	return /** @type {LocalizedString} */ ("The format must contain exactly one NNN counter.")
});